import { readConsent, startAnalytics, stopAnalytics, trackCta, trackEvent, writeConsent } from './consent'

function clearCookie() {
  document.cookie = 'cookie_consent=; max-age=0; path=/'
}

describe('consent', () => {
  afterEach(() => {
    clearCookie()
    document.querySelectorAll('script[data-goatcounter]').forEach((s) => s.remove())
    delete (window as Window & { goatcounter?: unknown }).goatcounter
  })

  it('starts unanswered and stores the answer in a real cookie', () => {
    expect(readConsent()).toBeNull()
    writeConsent('yes')
    expect(document.cookie).toContain('cookie_consent=yes')
    expect(readConsent()).toBe('yes')
    writeConsent('no')
    expect(readConsent()).toBe('no')
  })

  it('loads GoatCounter once, only with a site code', () => {
    startAnalytics('')
    expect(document.querySelector('script[data-goatcounter]')).toBeNull()
    startAnalytics('natalia')
    startAnalytics('natalia')
    const scripts = document.querySelectorAll('script[data-goatcounter]')
    expect(scripts).toHaveLength(1)
    expect(scripts[0].getAttribute('data-goatcounter')).toBe('https://natalia.goatcounter.com/count')
  })

  it('"No" switches GoatCounter off: script removed, counting disabled, opt-out flag set', () => {
    startAnalytics('natalia')
    // GoatCounter's script, once loaded, exposes window.goatcounter.count
    const counted = vi.fn()
    ;(window as Window & { goatcounter?: { count: () => void } }).goatcounter = { count: counted }

    stopAnalytics()
    expect(document.querySelector('script[data-goatcounter]')).toBeNull()
    ;(window as Window & { goatcounter?: { count: () => void } }).goatcounter!.count()
    expect(counted).not.toHaveBeenCalled()
    expect(localStorage.getItem('skipgc')).toBe('t')
  })

  it('"Yes" after "No" turns counting back on', () => {
    stopAnalytics()
    startAnalytics('natalia')
    expect(localStorage.getItem('skipgc')).toBeNull()
    expect(document.querySelectorAll('script[data-goatcounter]')).toHaveLength(1)
    expect((window as Window & { goatcounter?: { no_onload?: boolean } }).goatcounter?.no_onload).toBeUndefined()
  })

  it('trackEvent counts a click as an event only after "Yes", and not after a later "No"', () => {
    const count = vi.fn()
    ;(window as Window & { goatcounter?: unknown }).goatcounter = { count }
    trackEvent('cta-book-intro')
    expect(count).not.toHaveBeenCalled() // unanswered

    writeConsent('yes')
    trackEvent('cta-book-intro')
    expect(count).toHaveBeenCalledWith({ path: 'cta-book-intro', title: 'cta-book-intro', event: true })

    writeConsent('no')
    stopAnalytics()
    count.mockClear()
    trackEvent('cta-email-intro')
    expect(count).not.toHaveBeenCalled()
  })

  it('trackCta names the event cta-<button>-<place>, or cta-<button> without a place', () => {
    const count = vi.fn()
    ;(window as Window & { goatcounter?: unknown }).goatcounter = { count }
    writeConsent('yes')
    trackCta('book', 'cv-top')
    trackCta('email')
    expect(count.mock.calls.map(([e]) => e.path)).toEqual(['cta-book-cv-top', 'cta-email'])
  })
})
