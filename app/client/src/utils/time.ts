export function formatTime12Hour(value: string): string {
  const [hoursValue, minutesValue = '00'] = value.split(':')
  const hours = Number(hoursValue)
  const minutes = Number(minutesValue)
  if (!Number.isInteger(hours) || hours < 0 || hours > 23 || !Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
    return value
  }
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours % 12 || 12
  return `${displayHour}:${String(minutes).padStart(2, '0')}${period}`
}

export function formatShiftTime(shift: { startTime: string; endTime: string }): string {
  return `${formatTime12Hour(shift.startTime)}–${formatTime12Hour(shift.endTime)}`
}
