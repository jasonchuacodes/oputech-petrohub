import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { AttendanceService } from './attendance.service'

@Injectable()
export class AttendanceAutoCheckoutJob implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AttendanceAutoCheckoutJob.name)
  private running = false
  private timer?: NodeJS.Timeout

  constructor(private readonly attendance: AttendanceService) {}

  onModuleInit() {
    this.timer = setInterval(() => {
      void this.closeStaleSessions().catch((error: unknown) => {
        this.logger.error('Unable to automatically close stale attendance sessions.', error)
      })
    }, 60_000)
    this.timer.unref()
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer)
  }

  private async closeStaleSessions() {
    if (this.running) return
    this.running = true
    try {
      await this.attendance.closeStaleSessions()
    } finally {
      this.running = false
    }
  }
}
