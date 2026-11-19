import { hasUnlocked, isDecember, isLocked, rememberUnlocked } from './lock'

describe('lock', () => {
  it('is locked outside December until the snowman is built', () => {
    expect(isLocked(new Date(2026, 10, 30))).toBe(true)
    expect(isLocked(new Date(2027, 0, 5))).toBe(true)
    rememberUnlocked()
    expect(hasUnlocked()).toBe(true)
    expect(isLocked(new Date(2026, 10, 30))).toBe(false)
  })

  it('is open all of December', () => {
    expect(isDecember(new Date(2026, 11, 1))).toBe(true)
    expect(isLocked(new Date(2026, 11, 1))).toBe(false)
    expect(isLocked(new Date(2026, 11, 31))).toBe(false)
  })
})
