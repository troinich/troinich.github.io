import { hasUnlocked, isDecember, isLocked, rememberUnlocked, unlockFromShareLink } from './lock'

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

  it('the shared ?open link unlocks for good and is removed from the address, keeping the rest', () => {
    window.history.replaceState(null, '', '/?open&utm_source=linkedin#door-5')
    unlockFromShareLink()
    expect(hasUnlocked()).toBe(true)
    expect(window.location.pathname + window.location.search + window.location.hash).toBe(
      '/?utm_source=linkedin#door-5',
    )
    window.history.replaceState(null, '', '/')
  })

  it('a plain visit does not unlock', () => {
    window.history.replaceState(null, '', '/?utm_source=linkedin')
    unlockFromShareLink()
    expect(hasUnlocked()).toBe(false)
    expect(window.location.search).toBe('?utm_source=linkedin')
    window.history.replaceState(null, '', '/')
  })
})
