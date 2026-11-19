import { emailHref } from './contact'

describe('contact', () => {
  it('builds a mailto link to the CV address with a friendly subject', () => {
    const href = emailHref()
    expect(href.startsWith(`mailto:${atob('dHJvaW5pY3pAZ21haWwuY29t')}?`)).toBe(true) // the CV address, encoded so it isn't plain text here
    expect(decodeURIComponent(href)).toContain('subject=Hi Natalia, let’s talk about a role')
  })
})
