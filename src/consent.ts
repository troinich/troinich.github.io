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
    document.cookie = `${COOKIE}=${value}; max-age=${ONE_YEAR}; path=/; SameSite=Lax`
  } catch {
    // Cookies blocked: we simply ask again next time.
  }
}

/** Loads GoatCounter, which records this visit. Only ever called after a "yes". */
export function startAnalytics(code: string = GOATCOUNTER_CODE) {
  if (!code || document.querySelector('script[data-goatcounter]')) return
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://gc.zgo.at/count.js'
  s.dataset.goatcounter = `https://${code}.goatcounter.com/count`
  document.head.appendChild(s)
}
