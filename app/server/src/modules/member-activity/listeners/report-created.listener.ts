import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
  REPORT_CREATED_EVENT,
  ReportCreatedEvent,
} from '../../reports/events/report-created.event'
import { MemberActivityService } from '../member-activity.service'

@Injectable()
export class ReportCreatedListener {
  private readonly logger = new Logger(ReportCreatedListener.name)

  constructor(private readonly memberActivity: MemberActivityService) {}

  @OnEvent(REPORT_CREATED_EVENT)
  async handle(event: ReportCreatedEvent): Promise<void> {
    try {
      await this.memberActivity.recordReportCreated(event)
    } catch (error) {
      this.logger.error({ error, reportId: event.reportId.toHexString() }, 'Activity write failed')
    }
  }
}
