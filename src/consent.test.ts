import { readConsent, startAnalytics, writeConsent } from './consent'

function clearCookie() {
  document.cookie = 'cookie_consent=; max-age=0; path=/'
}

describe('consent', () => {
  afterEach(() => {
    clearCookie()
    document.querySelectorAll('script[data-goatcounter]').forEach((s) => s.remove())
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
})
