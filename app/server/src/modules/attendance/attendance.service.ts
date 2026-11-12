import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import Decimal from 'decimal.js'
import { ClientSession, Model, Types } from 'mongoose'
import {
  ConflictException,
  NotFoundException,
} from '../../common/exceptions'
import { User, UserRole, UserStatus } from '../users/schemas/user.schema'
import { addLocalDays, assertLocalDate, currentWeek, datesBetween, localDateFor, startOfLocalDate } from './attendance-date'
import {
  CheckInAttendanceInput,
  CheckOutAttendanceInput,
  SetTimesheetDayOverrideInput,
  TimesheetDaysFilter,
  TimesheetsFilter,
} from './attendance.schemas'
import { AttendanceSession } from './schemas/attendance-session.schema'
import { TimesheetDay } from './schemas/timesheet-day.schema'
import { Tenant } from '../tenants/schemas/tenant.schema'

const automaticDailyCapMs = 8 * 60 * 60 * 1000

type AttendanceScope = {
  tenantId: Types.ObjectId
  userId: Types.ObjectId
  timezone: string
}

type AttendanceSessionRecord = AttendanceSession & { _id: Types.ObjectId }
type TimesheetDayRecord = TimesheetDay & { _id: Types.ObjectId }
type MemberRecord = Pick<User, 'firstName' | 'lastName' | 'username'> & { _id: Types.ObjectId }
type TenantTimezoneRecord = Pick<Tenant, 'timezone'> & { _id: Types.ObjectId }

export type CalculatedTimesheetDay = {
  localDate: string
  trackedMs: number
  automaticMs: number
  checkInAt: Date | null
  checkOutAt: Date | null
  hasOpenSession: boolean
  overrideHours: string | null
  effectiveHours: Decimal
  revision: number
}

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(AttendanceSession.name)
    private readonly sessions: Model<AttendanceSession>,
    @InjectModel(TimesheetDay.name)
    private readonly timesheetDays: Model<TimesheetDay>,
    @InjectModel(User.name)
    private readonly users: Model<User>,
    @InjectModel(Tenant.name)
    private readonly tenants: Model<Tenant>,
  ) {}

  async status(scope: AttendanceScope, now = new Date()) {
    await this.closeStaleSessions(now, scope.tenantId, scope.userId)
    const localDate = localDateFor(scope.timezone, now)
    const calculated = await this.calculateDays(
      scope.tenantId,
      [scope.userId],
      localDate,
      localDate,
      scope.timezone,
      now,
    )
    const day = calculated.get(this.dayKey(scope.userId, localDate))!
    const activeSession = await this.sessions
      .findOne({ tenantId: scope.tenantId, userId: scope.userId, endedAt: null })
      .lean<AttendanceSessionRecord>()
      .exec()

    return {
      localDate,
      timezone: scope.timezone,
      asOf: now,
      trackedSeconds: Math.floor(day.trackedMs / 1000),
      automaticSeconds: Math.floor(day.automaticMs / 1000),
      activeSession,
    }
  }

  async checkIn(scope: AttendanceScope, input: CheckInAttendanceInput) {
    const retried = await this.sessions
      .findOne({
        tenantId: scope.tenantId,
        userId: scope.userId,
        idempotencyKey: input.idempotencyKey,
      })
      .select('_id')
      .lean()
      .exec()
    if (retried) return this.status(scope)

    await this.closeStaleSessions(new Date(), scope.tenantId, scope.userId)

    const active = await this.sessions.exists({
      tenantId: scope.tenantId,
      userId: scope.userId,
      endedAt: null,
    })
    if (active) throw new ConflictException('You are already checked in.')

    try {
      await this.sessions.create({
        tenantId: scope.tenantId,
        userId: scope.userId,
        startedAt: new Date(),
        endedAt: null,
        idempotencyKey: input.idempotencyKey,
      })
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error
      const accepted = await this.sessions.exists({
        tenantId: scope.tenantId,
        userId: scope.userId,
        idempotencyKey: input.idempotencyKey,
      })
      if (!accepted) throw new ConflictException('Attendance changed. Refresh and try again.')
    }

    return this.status(scope)
  }

  async checkOut(scope: AttendanceScope, input: CheckOutAttendanceInput) {
    const endedAt = new Date()
    const closed = await this.sessions
      .findOneAndUpdate(
        {
          _id: input.sessionId,
          tenantId: scope.tenantId,
          userId: scope.userId,
          endedAt: null,
        },
        { $set: { endedAt } },
        { new: true },
      )
      .select('_id')
      .lean()
      .exec()

    if (!closed) {
      const existing = await this.sessions.exists({
        _id: input.sessionId,
        tenantId: scope.tenantId,
        userId: scope.userId,
      })
      if (!existing) throw new NotFoundException('Active attendance session not found.')
    }
    return this.status(scope, endedAt)
  }

  async list(tenantId: Types.ObjectId, timezone: string, filter: TimesheetsFilter) {
    const now = new Date()
    await this.closeStaleSessions(now, tenantId, filter.userId ?? undefined)
    const range = filter.startDate && filter.endDate
      ? { startDate: filter.startDate, endDate: filter.endDate }
      : currentWeek(timezone, now)
    datesBetween(range.startDate, range.endDate)

    const memberFilter = {
      tenantIds: tenantId,
      role: UserRole.MEMBER,
      status: UserStatus.ACTIVE,
      ...(filter.userId ? { _id: filter.userId } : {}),
    }
    const [members, totalCount] = await Promise.all([
      this.users
        .find(memberFilter)
        .sort({ username: 1, _id: 1 })
        .skip(filter.offset)
        .limit(filter.limit)
        .select('firstName lastName username')
        .lean<MemberRecord[]>()
        .exec(),
      this.users.countDocuments(memberFilter).exec(),
    ])
    const calculated = await this.calculateDays(
      tenantId,
      members.map((member) => member._id),
      range.startDate,
      range.endDate,
      timezone,
      now,
    )
    const dates = datesBetween(range.startDate, range.endDate)
    const items = members.map((member) => {
      const totalHours = dates.reduce(
        (total, date) => total.plus(calculated.get(this.dayKey(member._id, date))!.effectiveHours),
        new Decimal(0),
      )
      return {
        userId: member._id,
        fullName: this.fullName(member),
        username: member.username,
        totalHours: totalHours.toDecimalPlaces(4).toString(),
      }
    })

    return { ...range, timezone, asOf: now, items, totalCount }
  }

  async days(tenantId: Types.ObjectId, timezone: string, filter: TimesheetDaysFilter) {
    await this.closeStaleSessions(new Date(), tenantId, filter.userId)
    const member = await this.member(tenantId, filter.userId)
    const dates = datesBetween(filter.startDate, filter.endDate)
    const calculated = await this.calculateDays(
      tenantId,
      [filter.userId],
      filter.startDate,
      filter.endDate,
      timezone,
      new Date(),
    )
    return {
      userId: member._id,
      fullName: this.fullName(member),
      username: member.username,
      timezone,
      days: dates.map((date) => calculated.get(this.dayKey(filter.userId, date))!),
    }
  }

  async closeStaleSessions(now = new Date(), tenantId?: Types.ObjectId, userId?: Types.ObjectId) {
    const openSessions = await this.sessions
      .find({
        endedAt: null,
        ...(tenantId ? { tenantId } : {}),
        ...(userId ? { userId } : {}),
      })
      .select('_id tenantId startedAt')
      .lean<AttendanceSessionRecord[]>()
      .exec()
    if (openSessions.length === 0) return 0

    const tenantIds = [...new Set(openSessions.map((session) => session.tenantId.toHexString()))]
      .map((id) => new Types.ObjectId(id))
    const tenants = await this.tenants
      .find({ _id: { $in: tenantIds } })
      .select('timezone')
      .lean<TenantTimezoneRecord[]>()
      .exec()
    const timezones = new Map(tenants.map((tenant) => [tenant._id.toHexString(), tenant.timezone]))
    const operations = openSessions.flatMap((session) => {
      const timezone = timezones.get(session.tenantId.toHexString())
      if (!timezone) return []
      const startedDate = localDateFor(timezone, session.startedAt)
      const cutoff = startOfLocalDate(addLocalDays(startedDate, 1), timezone)
      if (cutoff.getTime() > now.getTime()) return []
      return [{
        updateOne: {
          filter: { _id: session._id, endedAt: null },
          update: { $set: { endedAt: cutoff } },
        },
      }]
    })
    if (operations.length === 0) return 0

    const result = await this.sessions.bulkWrite(operations)
    return result.modifiedCount
  }

  async setOverride(
    tenantId: Types.ObjectId,
    timezone: string,
    actorId: Types.ObjectId,
    input: SetTimesheetDayOverrideInput,
  ) {
    await this.member(tenantId, input.userId)
    assertLocalDate(input.localDate)
    const overrideHours = input.overrideHours === null
      ? null
      : Types.Decimal128.fromString(input.overrideHours)

    let record: TimesheetDayRecord | null
    if (input.expectedRevision === 0) {
      try {
        record = await this.timesheetDays.create({
          tenantId,
          userId: input.userId,
          localDate: input.localDate,
          overrideHours,
          updatedById: actorId,
          revision: 1,
        }).then((document) => document.toObject<TimesheetDayRecord>())
      } catch (error) {
        if (isDuplicateKeyError(error)) {
          throw new ConflictException('This timesheet was changed. Reload and try again.')
        }
        throw error
      }
    } else {
      record = await this.timesheetDays
        .findOneAndUpdate(
          {
            tenantId,
            userId: input.userId,
            localDate: input.localDate,
            revision: input.expectedRevision,
          },
          {
            $set: { overrideHours, updatedById: actorId },
            $inc: { revision: 1 },
          },
          { new: true, runValidators: true },
        )
        .lean<TimesheetDayRecord>()
        .exec()
      if (!record) throw new ConflictException('This timesheet was changed. Reload and try again.')
    }

    const result = await this.days(tenantId, timezone, {
      userId: input.userId,
      startDate: input.localDate,
      endDate: input.localDate,
    })
    return result.days[0]
  }

  async deleteForTenant(tenantId: Types.ObjectId, session: ClientSession) {
    const [sessions, days] = await Promise.all([
      this.sessions.deleteMany({ tenantId }, { session }),
      this.timesheetDays.deleteMany({ tenantId }, { session }),
    ])
    return { sessions: sessions.deletedCount, days: days.deletedCount }
  }

  async deleteForUser(tenantId: Types.ObjectId, userId: Types.ObjectId, session: ClientSession) {
    await Promise.all([
      this.sessions.deleteMany({ tenantId, userId }, { session }),
      this.timesheetDays.deleteMany({ tenantId, userId }, { session }),
    ])
  }

  private async calculateDays(
    tenantId: Types.ObjectId,
    userIds: Types.ObjectId[],
    startDate: string,
    endDate: string,
    timezone: string,
    asOf: Date,
  ): Promise<Map<string, CalculatedTimesheetDay>> {
    const dates = datesBetween(startDate, endDate)
    const result = new Map<string, CalculatedTimesheetDay>()
    for (const userId of userIds) {
      for (const localDate of dates) {
        result.set(this.dayKey(userId, localDate), {
          localDate,
          trackedMs: 0,
          automaticMs: 0,
          checkInAt: null,
          checkOutAt: null,
          hasOpenSession: false,
          overrideHours: null,
          effectiveHours: new Decimal(0),
          revision: 0,
        })
      }
    }
    if (userIds.length === 0) return result

    const rangeStart = startOfLocalDate(startDate, timezone)
    const rangeEnd = startOfLocalDate(addLocalDays(endDate, 1), timezone)
    const [sessions, overrides] = await Promise.all([
      this.sessions
        .find({
          tenantId,
          userId: { $in: userIds },
          startedAt: { $lt: rangeEnd },
          $or: [{ endedAt: null }, { endedAt: { $gt: rangeStart } }],
        })
        .lean<AttendanceSessionRecord[]>()
        .exec(),
      this.timesheetDays
        .find({
          tenantId,
          userId: { $in: userIds },
          localDate: { $gte: startDate, $lte: endDate },
        })
        .lean<TimesheetDayRecord[]>()
        .exec(),
    ])

    for (const attendance of sessions) {
      const sessionStart = attendance.startedAt.getTime()
      const sessionEnd = Math.min(attendance.endedAt?.getTime() ?? asOf.getTime(), asOf.getTime())
      if (sessionEnd <= sessionStart) continue
      for (const localDate of dates) {
        const dayStart = startOfLocalDate(localDate, timezone).getTime()
        const dayEnd = startOfLocalDate(addLocalDays(localDate, 1), timezone).getTime()
        const overlap = Math.max(0, Math.min(sessionEnd, dayEnd) - Math.max(sessionStart, dayStart))
        if (overlap <= 0) continue
        const day = result.get(this.dayKey(attendance.userId, localDate))!
        day.trackedMs += overlap
        const checkInAt = new Date(Math.max(sessionStart, dayStart))
        if (!day.checkInAt || checkInAt < day.checkInAt) day.checkInAt = checkInAt
        if (attendance.endedAt === null) {
          day.hasOpenSession = true
        } else {
          const checkOutAt = new Date(Math.min(sessionEnd, dayEnd))
          if (!day.checkOutAt || checkOutAt > day.checkOutAt) day.checkOutAt = checkOutAt
        }
      }
    }

    for (const day of result.values()) {
      if (day.hasOpenSession) day.checkOutAt = null
      day.automaticMs = Math.min(day.trackedMs, automaticDailyCapMs)
      day.effectiveHours = hoursForMilliseconds(day.automaticMs)
    }
    for (const override of overrides) {
      const day = result.get(this.dayKey(override.userId, override.localDate))
      if (!day) continue
      day.overrideHours = override.overrideHours?.toString() ?? null
      day.revision = override.revision
      if (day.overrideHours !== null) day.effectiveHours = new Decimal(day.overrideHours)
    }
    return result
  }

  private async member(tenantId: Types.ObjectId, userId: Types.ObjectId): Promise<MemberRecord> {
    const member = await this.users
      .findOne({
        _id: userId,
        tenantIds: tenantId,
        role: UserRole.MEMBER,
        status: UserStatus.ACTIVE,
      })
      .select('firstName lastName username')
      .lean<MemberRecord>()
      .exec()
    if (!member) throw new NotFoundException('User not found.')
    return member
  }

  private dayKey(userId: Types.ObjectId, localDate: string) {
    return `${userId.toHexString()}:${localDate}`
  }

  private fullName(user: Pick<User, 'firstName' | 'lastName' | 'username'>) {
    return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username
  }
}

export function serializeCalculatedDay(day: CalculatedTimesheetDay) {
  return {
    localDate: day.localDate,
    trackedSeconds: Math.floor(day.trackedMs / 1000),
    automaticSeconds: Math.floor(day.automaticMs / 1000),
    checkInAt: day.checkInAt?.toISOString() ?? null,
    checkOutAt: day.checkOutAt?.toISOString() ?? null,
    overrideHours: day.overrideHours,
    effectiveHours: day.effectiveHours.toDecimalPlaces(4).toString(),
    revision: day.revision,
  }
}

function hoursForMilliseconds(milliseconds: number): Decimal {
  return new Decimal(milliseconds).div(60 * 60 * 1000)
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11_000
}
