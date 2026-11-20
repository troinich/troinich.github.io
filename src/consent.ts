import { GOATCOUNTER_CODE } from './config'

export type Consent = 'yes' | 'no'

const COOKIE = 'cookie_consent'
const ONE_YEAR = 60 * 60 * 24 * 365

/** The visitor's answer is stored in a real cookie (fitting, really). */
export function readConsent(): Consent | null {
  try {
    const match = document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE}=`))
    const value = match?.split('=')[1]
    return value === 'yes' || value === 'no' ? value : null
  } catch {
    return null
  }
}

export function writeConsent(value: Consent) {
  try {
    // Secure on the live (HTTPS) site; left off on http://localhost, where some browsers would drop it
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${COOKIE}=${value}; max-age=${ONE_YEAR}; path=/; SameSite=Lax${secure}`
  } catch {
    // Cookies blocked: we simply ask again next time.
  }
}

type GoatCounter = { no_onload?: boolean; count?: (...args: unknown[]) => void }
type WithGoatCounter = Window & { goatcounter?: GoatCounter }

/** GoatCounter's own opt-out flag: when set, its script never counts in this browser. */
const SKIP_KEY = 'skipgc'

/** Loads GoatCounter, which records this visit. Only ever called after a "yes". */
export function startAnalytics(code: string = GOATCOUNTER_CODE) {
  if (!code) return
  // undo an earlier "no" in this browser
  try {
    localStorage.removeItem(SKIP_KEY)
  } catch {
    // ignore
  }
  const gc = (window as WithGoatCounter).goatcounter
  if (gc) delete gc.no_onload
  if (document.querySelector('script[data-goatcounter]')) return
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://gc.zgo.at/count.js'
  s.dataset.goatcounter = `https://${code}.goatcounter.com/count`
  document.head.appendChild(s)
}

/**
 * Switches GoatCounter off after a "no" (including a "yes" changed to "no"):
 * removes the script, stops a script that is still loading from counting,
 * makes any later count call do nothing, and sets GoatCounter's own opt-out flag.
 * Visits already counted stay in the stats as anonymous totals.
 */
export function stopAnalytics() {
  document.querySelectorAll('script[data-goatcounter]').forEach((s) => s.remove())
  const w = window as WithGoatCounter
  w.goatcounter = { ...(w.goatcounter ?? {}), no_onload: true, count: () => {} }
  try {
    localStorage.setItem(SKIP_KEY, 't')
  } catch {
    // ignore: the script is removed and disabled anyway
  }
}
