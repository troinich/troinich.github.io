import { todayDoorId } from './today'

describe('todayDoorId', () => {
  it('uses the day of the month for days 1–24', () => {
    expect(todayDoorId(new Date(2026, 11, 1))).toBe(1)
    expect(todayDoorId(new Date(2026, 10, 19))).toBe(19)
    expect(todayDoorId(new Date(2026, 11, 24))).toBe(24)
  })

  it('opens door 24 on days 25–31', () => {
    expect(todayDoorId(new Date(2026, 11, 25))).toBe(24)
    expect(todayDoorId(new Date(2026, 11, 31))).toBe(24)
  })
})
