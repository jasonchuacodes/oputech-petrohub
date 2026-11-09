import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ReportCreatedEvent } from '../reports/events/report-created.event'
import { ActivityEntityType, MemberActivity } from './schemas/member-activity.schema'

@Injectable()
export class MemberActivityService {
  constructor(
    @InjectModel(MemberActivity.name) private readonly activities: Model<MemberActivity>,
  ) {}

  async recordReportCreated(event: ReportCreatedEvent): Promise<void> {
    const eventKey = `report-created:${event.reportId.toHexString()}`
    await this.activities.updateOne(
      { tenantId: event.tenantId, eventKey },
      {
        $setOnInsert: {
          tenantId: event.tenantId,
          memberId: event.memberId,
          action: `created report: ${event.reportId.toHexString()}`,
          entityType: ActivityEntityType.REPORT,
          entityId: event.reportId,
          eventKey,
          createdAt: event.occurredAt,
        },
      },
      { upsert: true },
    )
  }
}
