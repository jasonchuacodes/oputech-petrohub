'use client'

import { useEffect, useState } from 'react'
import {
  useCheckInAttendanceMutation,
  useCheckOutAttendanceMutation,
  useMyAttendanceQuery,
} from '../../attendance/attendance.queries'
import { formatDuration, formatTimesheetDate } from '../../attendance/attendance.utils'

export function AttendanceCard({ tenantId }: { tenantId: string }) {
  const attendance = useMyAttendanceQuery(tenantId)
  const checkIn = useCheckInAttendanceMutation(tenantId)
  const checkOut = useCheckOutAttendanceMutation(tenantId)
  const [now, setNow] = useState(() => Date.now())
  const status = attendance.data
  const isCheckedIn = Boolean(status?.activeSession)
  const pending = checkIn.isPending || checkOut.isPending

  useEffect(() => {
    if (!isCheckedIn) return
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [isCheckedIn, status?.asOf])

  const elapsedSinceSnapshot = status?.activeSession
    ? Math.max(0, Math.floor((now - Date.parse(status.asOf)) / 1000))
    : 0
  const trackedSeconds = (status?.trackedSeconds ?? 0) + elapsedSinceSnapshot
  const mutationError = checkIn.isError || checkOut.isError

  const toggle = () => {
    if (!status || pending) return
    if (status.activeSession) checkOut.mutate(status.activeSession.id)
    else checkIn.mutate()
  }

  return (
    <section
      aria-label="Attendance status"
      className="overflow-hidden rounded-md bg-primary text-primary-foreground shadow-card"
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-white/75 sm:text-base">
            {status ? formatTimesheetDate(status.localDate) : 'Today'}
          </p>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${
                isCheckedIn ? 'bg-emerald-400 shadow-[0_0_0_3px_rgb(52_211_153/0.15)]' : 'bg-white/40'
              }`}
            />
            {attendance.isPending ? 'Loading' : isCheckedIn ? 'On shift' : 'Off shift'}
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-[0.14em] text-white/60 uppercase">
              Time today
            </p>
            <p className="mt-1 text-[clamp(1.5rem,5vw,2.5rem)] leading-none font-semibold tracking-tight text-white tabular-nums">
              {attendance.isPending ? '--:--:--' : formatDuration(trackedSeconds)}
              <span className="ml-2 text-base font-medium tracking-normal text-white/65">hrs</span>
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isCheckedIn}
            aria-label={isCheckedIn ? 'Check out' : 'Check in'}
            disabled={!status || pending}
            onClick={toggle}
            className="group flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-md p-2 text-sm font-semibold text-white outline-none transition-transform active:scale-[0.99] focus-visible:ring-3 focus-visible:ring-white/60 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14 sm:px-4"
          >
            <span className="hidden sm:inline">
              {pending ? 'Saving…' : isCheckedIn ? 'Check out' : 'Check in'}
            </span>
            <span
              aria-hidden="true"
              className={`flex h-9 w-15 items-center rounded-full p-0.5 transition-colors duration-200 ${
                isCheckedIn ? 'bg-emerald-500' : 'bg-white/25'
              }`}
            >
              <span
                className={`size-8 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  isCheckedIn ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </span>
          </button>
        </div>

        <p className="mt-4 text-xs text-white/65">Daily credited time is capped at 8 hours.</p>
        {(attendance.isError || mutationError) && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-sm bg-white/10 px-3 py-2 text-sm text-white/90">
            <span>Unable to update attendance.</span>
            <button type="button" className="font-semibold underline" onClick={() => void attendance.refetch()}>
              Retry
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
