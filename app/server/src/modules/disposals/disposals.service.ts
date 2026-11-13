import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ClientSession, Model, Types } from 'mongoose'
import { ConflictException, InvalidInputException, NotFoundException } from '../../common/exceptions'
import { decimal, decimal128, money, sum } from '../../common/numeric/decimal'
import { FuelSetupService } from '../fuel-setup/fuel-setup.service'
import { EditableDisposalInput } from './disposals.schemas'
import { DisposalBatch, DisposalBatchStatus, DisposalReading } from './schemas/disposal-batch.schema'
import { MeterHead } from './schemas/meter-head.schema'

export type DisposalBatchRecord = DisposalBatch & { _id: Types.ObjectId }
type MeterHeadRecord = MeterHead & { _id: Types.ObjectId }
type RevocationActor = { userId: Types.ObjectId; name: string }

@Injectable()
export class DisposalsService {
  constructor(
    @InjectModel(DisposalBatch.name) private readonly batches: Model<DisposalBatch>,
    @InjectModel(MeterHead.name) private readonly heads: Model<MeterHead>,
    private readonly fuelSetup: FuelSetupService,
  ) {}

  async getForReport(tenantId: Types.ObjectId, reportId: Types.ObjectId) {
    return this.batches.findOne({ tenantId, reportId }).lean<DisposalBatchRecord>().exec()
  }

  async getForReports(tenantId: Types.ObjectId, reportIds: Types.ObjectId[]) {
    if (reportIds.length === 0) return []
    return this.batches
      .find({ tenantId, reportId: { $in: reportIds } })
      .lean<DisposalBatchRecord[]>()
      .exec()
  }

  async initializeForReport(
    input: {
      tenantId: Types.ObjectId
      reportId: Types.ObjectId
      businessDate: string
      shiftId: Types.ObjectId
      intervalStartAt: Date
    },
    session: ClientSession,
  ): Promise<DisposalBatchRecord> {
    const setup = await this.fuelSetup.activeSnapshot(input.tenantId, session, input.intervalStartAt)
    if (setup.meters.length === 0) throw new InvalidInputException('Configure at least one active pump meter before creating a report.')
    const products = new Map(setup.products.map((product) => [product._id.toHexString(), product]))
    const meterIds = setup.meters.map((meter) => meter._id)
    const existingHeads = await this.heads.find({ tenantId: input.tenantId, meterId: { $in: meterIds } }).session(session).lean<MeterHeadRecord[]>().exec()
    const headsByMeter = new Map(existingHeads.map((head) => [head.meterId.toHexString(), head]))

    for (const meter of setup.meters) {
      if (!products.has(meter.productId.toHexString())) throw new InvalidInputException(`${meter.label} does not have an active fuel product.`)
      if (headsByMeter.has(meter._id.toHexString())) continue
      const [created] = await this.heads.create([{
        tenantId: input.tenantId,
        meterId: meter._id,
        reading: meter.initialReading,
      }], { session })
      if (!created) throw new ConflictException('Unable to initialize the pump meter.')
      headsByMeter.set(meter._id.toHexString(), created.toObject<MeterHeadRecord>())
    }

    const predecessor = await this.batches.findOne({
      tenantId: input.tenantId,
      status: DisposalBatchStatus.SUBMITTED,
      successorBatchId: { $exists: false },
    }).sort({ businessDate: -1, createdAt: -1 }).session(session).lean<DisposalBatchRecord>().exec()

    const readings = setup.meters.map((meter) => {
      const product = products.get(meter.productId.toHexString())
      const head = headsByMeter.get(meter._id.toHexString())
      if (!product || !head) throw new InvalidInputException('Fuel setup is incomplete.')
      return {
        meterId: meter._id,
        meterLabel: meter.label,
        productId: product._id,
        productName: product.name,
        unitPrice: product.unitPrice,
        openingReading: head.reading,
        openingSourceBatchId: head.sourceBatchId,
        openingHeadRevision: head.revision,
        calibration: decimal128(0),
      }
    })

    const [batchDocument] = await this.batches.create([{
      tenantId: input.tenantId,
      reportId: input.reportId,
      businessDate: input.businessDate,
      shiftId: input.shiftId,
      predecessorBatchId: predecessor?._id,
      readings,
      complete: false,
      blockingIssues: ['MISSING_CLOSING_READINGS'],
    }], { session })
    if (!batchDocument) throw new ConflictException('Unable to initialize disposal readings.')
    const batch = batchDocument.toObject<DisposalBatchRecord>()

    if (predecessor) {
      const linked = await this.batches.updateOne(
        { _id: predecessor._id, tenantId: input.tenantId, status: DisposalBatchStatus.SUBMITTED, successorBatchId: { $exists: false } },
        { $set: { successorBatchId: batch._id }, $inc: { revision: 1 } },
        { session },
      )
      if (linked.modifiedCount !== 1) throw new ConflictException('Another report was created first. Refresh and try again.')
    }
    return batch
  }

  async saveDraft(
    tenantId: Types.ObjectId,
    reportId: Types.ObjectId,
    expectedRevision: number,
    inputs: EditableDisposalInput[],
    session: ClientSession,
  ): Promise<DisposalBatchRecord> {
    const batch = await this.batches.findOne({ tenantId, reportId, status: DisposalBatchStatus.DRAFT }).session(session).lean<DisposalBatchRecord>().exec()
    if (!batch) throw new NotFoundException('Disposal readings not found.')
    if (batch.revision !== expectedRevision) throw new ConflictException('Disposal readings changed. Refresh and try again.')
    const byMeter = new Map(inputs.map((input) => [input.meterId.toHexString(), input]))
    if (byMeter.size !== inputs.length || inputs.length !== batch.readings.length) throw new InvalidInputException('Provide one reading for every configured meter.')

    const readings = batch.readings.map((reading) => {
      const editable = byMeter.get(reading.meterId.toHexString())
      if (!editable) throw new InvalidInputException('Provide one reading for every configured meter.')
      return this.calculateReading(reading, editable)
    })
    const complete = readings.every((reading) => reading.closingReading && reading.sales)
    const pumpSales = complete ? decimal128(sum(readings.map((reading) => reading.sales?.toString() ?? '0'))) : undefined
    const updated = await this.batches.findOneAndUpdate(
      { _id: batch._id, tenantId, revision: expectedRevision, status: DisposalBatchStatus.DRAFT },
      {
        $set: {
          readings,
          complete,
          blockingIssues: complete ? [] : ['MISSING_CLOSING_READINGS'],
          ...(pumpSales ? { pumpSales } : {}),
        },
        ...(pumpSales ? {} : { $unset: { pumpSales: 1 } }),
        $inc: { revision: 1 },
      },
      { new: true, runValidators: true, session },
    ).lean<DisposalBatchRecord>().exec()
    if (!updated) throw new ConflictException('Disposal readings changed. Refresh and try again.')
    return updated
  }

  async submitBatch(
    tenantId: Types.ObjectId,
    reportId: Types.ObjectId,
    expectedRevision: number,
    submittedAt: Date,
    session: ClientSession,
  ): Promise<DisposalBatchRecord> {
    const batch = await this.batches.findOne({ tenantId, reportId, revision: expectedRevision, status: DisposalBatchStatus.DRAFT, successorBatchId: { $exists: false } }).session(session).lean<DisposalBatchRecord>().exec()
    if (!batch) throw new ConflictException('Disposal readings changed or a later report already exists.')
    if (!batch.complete || !batch.pumpSales) throw new InvalidInputException('Complete every disposal reading before submitting.')

    for (const reading of batch.readings) {
      if (!reading.closingReading) throw new InvalidInputException('Complete every disposal reading before submitting.')
      const result = await this.heads.updateOne(
        {
          tenantId,
          meterId: reading.meterId,
          revision: reading.openingHeadRevision,
          reading: reading.openingReading,
          ...(reading.openingSourceBatchId ? { sourceBatchId: reading.openingSourceBatchId } : { sourceBatchId: { $exists: false } }),
        },
        { $set: { reading: reading.closingReading, sourceBatchId: batch._id }, $inc: { revision: 1 } },
        { session },
      )
      if (result.modifiedCount !== 1) throw new ConflictException(`${reading.meterLabel} changed in another report.`)
    }

    const updated = await this.batches.findOneAndUpdate(
      { _id: batch._id, revision: expectedRevision, status: DisposalBatchStatus.DRAFT },
      { $set: { status: DisposalBatchStatus.SUBMITTED, submittedAt }, $inc: { revision: 1 } },
      { new: true, runValidators: true, session },
    ).lean<DisposalBatchRecord>().exec()
    if (!updated) throw new ConflictException('Disposal readings changed. Refresh and try again.')
    return updated
  }

  async revokeForReport(
    tenantId: Types.ObjectId,
    reportId: Types.ObjectId,
    expectedRevision: number,
    actor: RevocationActor,
    reason: string,
    revokedAt: Date,
    session: ClientSession,
  ): Promise<DisposalBatchRecord> {
    const batch = await this.batches.findOne({
      tenantId,
      reportId,
      revision: expectedRevision,
      status: { $in: [DisposalBatchStatus.DRAFT, DisposalBatchStatus.SUBMITTED] },
      successorBatchId: { $exists: false },
    }).session(session).lean<DisposalBatchRecord>().exec()
    if (!batch) throw new ConflictException('This report changed or a later report already exists.')

    if (batch.status === DisposalBatchStatus.SUBMITTED) {
      for (const reading of batch.readings) {
        if (!reading.closingReading) throw new ConflictException('Submitted disposal readings are incomplete.')
        const update = reading.openingSourceBatchId
          ? { $set: { reading: reading.openingReading, sourceBatchId: reading.openingSourceBatchId }, $inc: { revision: 1 } }
          : { $set: { reading: reading.openingReading }, $unset: { sourceBatchId: 1 }, $inc: { revision: 1 } }
        const result = await this.heads.updateOne(
          { tenantId, meterId: reading.meterId, sourceBatchId: batch._id, reading: reading.closingReading },
          update,
          { session },
        )
        if (result.modifiedCount !== 1) throw new ConflictException(`${reading.meterLabel} is already used by a later report.`)
      }
    }

    if (batch.predecessorBatchId) {
      const unlinked = await this.batches.updateOne(
        { _id: batch.predecessorBatchId, tenantId, successorBatchId: batch._id },
        { $unset: { successorBatchId: 1 }, $inc: { revision: 1 } },
        { session },
      )
      if (unlinked.modifiedCount !== 1) throw new ConflictException('The disposal chain changed. Refresh and try again.')
    }

    const updated = await this.batches.findOneAndUpdate(
      { _id: batch._id, revision: expectedRevision, successorBatchId: { $exists: false } },
      {
        $set: {
          status: DisposalBatchStatus.REVOKED,
          revokedAt,
          revokedById: actor.userId,
          revokedByName: actor.name,
          revocationReason: reason,
        },
        $inc: { revision: 1 },
      },
      { new: true, runValidators: true, session },
    ).lean<DisposalBatchRecord>().exec()
    if (!updated) throw new ConflictException('The disposal chain changed. Refresh and try again.')
    return updated
  }

  async deleteForTenant(tenantId: Types.ObjectId, session: ClientSession) {
    const [batches, heads] = await Promise.all([
      this.batches.deleteMany({ tenantId }, { session }),
      this.heads.deleteMany({ tenantId }, { session }),
    ])
    return { batches: batches.deletedCount, heads: heads.deletedCount }
  }

  private calculateReading(reading: DisposalReading, input: EditableDisposalInput): DisposalReading {
    const calibration = decimal(input.calibration)
    if (input.closingReading === null) {
      return { ...reading, closingReading: undefined, calibration: decimal128(calibration), netVolume: undefined, sales: undefined }
    }
    const closing = decimal(input.closingReading)
    const opening = decimal(reading.openingReading)
    const gross = closing.minus(opening)
    if (gross.isNegative()) throw new InvalidInputException(`${reading.meterLabel} closing reading cannot be below its opening reading.`)
    if (calibration.greaterThan(gross)) throw new InvalidInputException(`${reading.meterLabel} calibration cannot exceed its gross disposal.`)
    const net = gross.minus(calibration)
    const sales = money(net.times(decimal(reading.unitPrice)))
    return {
      ...reading,
      closingReading: decimal128(closing),
      calibration: decimal128(calibration),
      netVolume: decimal128(net),
      sales: decimal128(sales),
    }
  }
}
