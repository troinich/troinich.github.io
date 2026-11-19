/**
 * Which door belongs to "today": the day of the month, capped at 24
 * so the 25th–31st land on the final door.
 */
export function todayDoorId(date: Date = new Date()): number {
  return Math.min(date.getDate(), 24)
}
