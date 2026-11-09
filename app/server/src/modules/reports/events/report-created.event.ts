import { Types } from 'mongoose'

export const REPORT_CREATED_EVENT = 'report.created'

export class ReportCreatedEvent {
  constructor(
    readonly tenantId: Types.ObjectId,
    readonly memberId: Types.ObjectId,
    readonly reportId: Types.ObjectId,
    readonly occurredAt: Date,
  ) {}
}
