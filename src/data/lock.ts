/**
 * The calendar is locked outside December, unless the visitor has
 * "cheated" by building the snowman. Winning is remembered in this browser.
 */
const UNLOCK_KEY = 'meet-me:unlocked'

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

/** Query parameter of the link I share with recruiters: troinich.github.io/?open */
const SHARE_PARAM = 'open'

/**
 * Visitors who come through my shared link (`?open`) skip the lock, so recruiters see the
 * calendar straight away instead of the snowman game. The unlock is remembered like a built
 * snowman, and the parameter is removed from the address bar so it isn't passed on by accident.
 */
export function unlockFromShareLink() {
  try {
    const url = new URL(window.location.href)
    if (!url.searchParams.has(SHARE_PARAM)) return
    rememberUnlocked()
    url.searchParams.delete(SHARE_PARAM)
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
  } catch {
    // no URL or history support: the visitor just gets the normal lock
  }
}

export function isLocked(date: Date = new Date()): boolean {
  return !isDecember(date) && !hasUnlocked()
}
