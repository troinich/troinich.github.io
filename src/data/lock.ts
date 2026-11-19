/**
 * The calendar is locked outside December, unless the visitor has
 * "cheated" by building the snowman. Winning is remembered in this browser.
 */
export const UNLOCK_KEY = 'meet-me:unlocked'

export function isDecember(date: Date = new Date()): boolean {
  return date.getMonth() === 11
}

export function hasUnlocked(): boolean {
  try {
    return localStorage.getItem(UNLOCK_KEY) === '1'
  } catch {
    return false
  }
}

export function rememberUnlocked() {
  try {
    localStorage.setItem(UNLOCK_KEY, '1')
  } catch {
    // storage unavailable: the visitor will just have to build another snowman next time
  }
}

export function isLocked(date: Date = new Date()): boolean {
  return !isDecember(date) && !hasUnlocked()
}
