import { readConsent, startAnalytics, stopAnalytics, writeConsent } from './consent'

function clearCookie() {
  document.cookie = 'cookie_consent=; max-age=0; path=/'
}

describe('consent', () => {
  afterEach(() => {
    clearCookie()
    document.querySelectorAll('script[data-goatcounter]').forEach((s) => s.remove())
    delete (window as Window & { goatcounter?: unknown }).goatcounter
  })

  it('is unanswered by default', () => {
    expect(readConsent()).toBeNull()
  })

  it('stores the answer in a real cookie', () => {
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
})
