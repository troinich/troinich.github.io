import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import App from './App'

function clearCookie() {
  document.cookie = 'cookie_consent=; max-age=0; path=/'
}

/** Render the app on a given day; `answered` sets the cookie consent so the question is skipped. */
function arrive(date: Date, { answered = true } = {}) {
  if (answered) document.cookie = 'cookie_consent=no; path=/'
  vi.useFakeTimers()
  vi.setSystemTime(date)
  render(<App />)
}

const DEC_5 = new Date(2026, 11, 5)
const NOV_19 = new Date(2026, 10, 19)

/** Open a door the way a visitor would, then its "Read more" card. */
function openDoorCard(id: number, headline: string) {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Door ${id}( \\(today\\))?, closed$`) }))
  fireEvent.click(screen.getByRole('button', { name: `Read more about ${headline}` }))
}

afterEach(() => {
  vi.useRealTimers()
  clearCookie()
})

describe('Arrival', () => {
  it("highlights today's door but does not open it", () => {
    arrive(DEC_5)
    const today = document.getElementById('door-5')!
    expect(today).toHaveClass('is-today', 'is-highlighted')
    act(() => vi.advanceTimersByTime(3000))
    expect(today).not.toHaveClass('is-open')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Door 5 (today), closed' })).toHaveAttribute('aria-expanded', 'false')
  })

  it("today's door has a red ribbon until it is opened", () => {
    arrive(DEC_5)
    expect(document.querySelector('#door-5 .door__ribbon')).toBeInTheDocument()
    expect(document.querySelectorAll('.door__ribbon')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Door 5 (today), closed' }))
    expect(document.querySelector('#door-5 .door__ribbon')).not.toBeInTheDocument()
  })

  it('the highlight fades after a few seconds, or as soon as a door is opened', () => {
    arrive(DEC_5)
    act(() => vi.advanceTimersByTime(5000))
    expect(document.getElementById('door-5')).not.toHaveClass('is-highlighted')
  })

  it('door 24 is today from the 25th to the 31st', () => {
    arrive(new Date(2026, 11, 28))
    expect(document.getElementById('door-24')).toHaveClass('is-today')
  })
})

describe('Cookie question', () => {
  it('is not asked on arrival, only after the first card the visitor closes', () => {
    arrive(DEC_5, { answered: false })
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.queryByRole('dialog', { name: 'Btw, cookie?' })).not.toBeInTheDocument()

    openDoorCard(5, 'TypeScript migration')
    expect(screen.queryByRole('dialog', { name: 'Btw, cookie?' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.getByRole('dialog', { name: 'Btw, cookie?' })).toBeInTheDocument()
  })

  it('is asked after closing the full CV, if no card came first', () => {
    arrive(DEC_5, { answered: false })
    fireEvent.click(screen.getByRole('button', { name: 'Show full CV' }))
    fireEvent.click(screen.getByRole('button', { name: /Back to calendar/ }))
    expect(screen.getByRole('dialog', { name: 'Btw, cookie?' })).toBeInTheDocument()
  })

  it('"See it in the full CV" from a card shows the question on top of the CV', () => {
    arrive(DEC_5, { answered: false })
    openDoorCard(5, 'TypeScript migration')
    fireEvent.click(screen.getByRole('button', { name: /See it in the full CV/ }))
    expect(screen.getByRole('dialog', { name: 'Natalia Troinich' })).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Btw, cookie?' })).toBeInTheDocument()

    // Escape answers the cookie question; the CV stays open underneath
    fireEvent.keyDown(screen.getByRole('button', { name: 'Yes!' }), { key: 'Escape' })
    act(() => vi.advanceTimersByTime(2300))
    expect(screen.queryByRole('dialog', { name: 'Btw, cookie?' })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Natalia Troinich' })).toBeInTheDocument()
  })

  it('"No" shows the broken cookie and stores the answer', () => {
    arrive(DEC_5, { answered: false })
    openDoorCard(5, 'TypeScript migration')
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    fireEvent.click(screen.getByRole('button', { name: 'No' }))
    expect(screen.getByRole('img', { name: 'A broken cookie' })).toHaveAttribute('src', '/cookie-broken.avif')
    expect(document.cookie).toContain('cookie_consent=no')
    act(() => vi.advanceTimersByTime(2300))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Door 5 (today), open' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('"Yes" shows the cookie being eaten and stores the answer', () => {
    arrive(DEC_5, { answered: false })
    openDoorCard(5, 'TypeScript migration')
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    fireEvent.click(screen.getByRole('button', { name: 'Yes!' }))
    expect(screen.getByRole('img', { name: 'A cookie being eaten' })).toBeInTheDocument()
    expect(document.cookie).toContain('cookie_consent=yes')
    act(() => vi.advanceTimersByTime(4000))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is only asked once', () => {
    arrive(DEC_5, { answered: false })
    openDoorCard(5, 'TypeScript migration')
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    fireEvent.click(screen.getByRole('button', { name: 'No' }))
    act(() => vi.advanceTimersByTime(2300))

    fireEvent.click(screen.getByRole('button', { name: 'Read more about TypeScript migration' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is never asked of returning visitors', () => {
    arrive(DEC_5)
    openDoorCard(5, 'TypeScript migration')
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('"Yes" then "No" from Cookie settings: GoatCounter is switched off and not loaded on the next visit', () => {
    arrive(DEC_5, { answered: false })
    openDoorCard(5, 'TypeScript migration')
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes!' }))
    act(() => vi.advanceTimersByTime(3000))
    expect(document.cookie).toContain('cookie_consent=yes')
    expect(document.querySelector('script[data-goatcounter]')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Cookie settings/ }))
    fireEvent.click(screen.getByRole('button', { name: 'No' }))
    expect(document.cookie).toContain('cookie_consent=no')
    expect(document.querySelector('script[data-goatcounter]')).not.toBeInTheDocument()
    expect(localStorage.getItem('skipgc')).toBe('t')
    act(() => vi.advanceTimersByTime(3000))
    cleanup()

    // next visit
    render(<App />)
    expect(document.querySelector('script[data-goatcounter]')).not.toBeInTheDocument()
  })

  it('can be reopened from Cookie settings', () => {
    arrive(DEC_5)
    fireEvent.click(screen.getByRole('button', { name: /Cookie settings/ }))
    expect(screen.getByRole('dialog', { name: 'Btw, cookie?' })).toBeInTheDocument()
  })
})

describe('Open all / Close all buttons', () => {
  it('shows Open all only when nothing is open, both when some are, Close all only when all are', () => {
    arrive(DEC_5)
    expect(screen.getByRole('button', { name: /Open all doors/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close all doors' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Door 5 (today), closed' }))
    expect(screen.getByRole('button', { name: /Open all doors/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close all doors' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Open all doors/ }))
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.queryByRole('button', { name: /Open all doors/ })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close all doors' }))
    expect(screen.queryByRole('button', { name: 'Close all doors' })).not.toBeInTheDocument()
  })
})

describe('Door 24 "Full CV" button', () => {
  it('opens the CV page, and "Back to calendar" returns with door 24 still open', () => {
    arrive(new Date(2026, 11, 24))
    fireEvent.click(screen.getByRole('button', { name: 'Door 24 (today), closed' }))
    fireEvent.click(screen.getByRole('button', { name: 'Full CV' }))
    expect(screen.getByRole('dialog', { name: 'Natalia Troinich' })).toBeInTheDocument()
    expect(document.getElementById('door-24')).toHaveClass('is-open')

    fireEvent.click(screen.getByRole('button', { name: /Back to calendar/ }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.getElementById('door-24')).toHaveClass('is-open')
  })
})

describe('Read more', () => {
  it('opens a detail card for an opened door and closes it with Escape', () => {
    arrive(new Date(2026, 11, 10))
    openDoorCard(10, 'Stripe payments, end to end')
    const dialog = screen.getByRole('dialog', { name: 'Stripe payments, end to end' })
    expect(dialog).toHaveTextContent('Set up automated Stripe Tax collection.')
    expect(dialog).toHaveTextContent('Today')
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    // the door stays open behind the card
    expect(screen.getByRole('button', { name: 'Door 10 (today), open', hidden: true })).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('Locked before December', () => {
  it('greets the visitor with "Too early!" and opens nothing', () => {
    arrive(NOV_19, { answered: false })
    expect(screen.getByRole('dialog', { name: 'Too early!' })).toHaveTextContent('Welcome to my Advent CV Calendar')
    expect(screen.getByRole('dialog', { name: 'Too early!' })).toHaveTextContent('Build a snowman in 3 clicks to unlock early.')
    expect(screen.getByRole('img', { name: /autumn maple leaf/ })).toBeInTheDocument() // November
    expect(document.querySelector('.snow')).not.toBeInTheDocument() // no falling snow while locked
    act(() => vi.advanceTimersByTime(3000))
    expect(document.querySelectorAll('.door.is-open')).toHaveLength(0)
  })

  it('"No, I\'ll wait" shows the full CV instead', () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: "No, I'll wait" }))
    expect(screen.queryByRole('dialog', { name: 'Too early!' })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Natalia Troinich' })).toBeInTheDocument()
  })

  it('"Back to calendar" from the CV offers the game again while locked', () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: "No, I'll wait" }))
    fireEvent.click(screen.getByRole('button', { name: /Back to calendar/ }))
    expect(screen.getByRole('dialog', { name: 'Too early!' })).toBeInTheDocument()
  })

  it('"Back to calendar" goes straight to the calendar once unlocked', () => {
    localStorage.setItem('meet-me:unlocked', '1')
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: 'Show full CV' }))
    fireEvent.click(screen.getByRole('button', { name: /Back to calendar/ }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('going back and forth between the game and the CV never opens a door', () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: "No, I'll wait" })) // -> CV
    fireEvent.click(screen.getByRole('button', { name: /Back to calendar/ })) // -> game
    fireEvent.click(screen.getByRole('button', { name: "No, I'll wait" })) // -> CV again
    expect(screen.getByRole('dialog', { name: 'Natalia Troinich' })).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(3000))
    expect(document.querySelectorAll('.door.is-open')).toHaveLength(0)
    expect(screen.getByRole('button', { name: 'Door 7, locked until December', hidden: true })).toBeInTheDocument()
  })

  it('"Open all doors" asks to build the snowman instead', () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: /Open all doors/, hidden: true }))
    expect(screen.getByRole('dialog', { name: 'Too early!' })).toBeInTheDocument()
  })

  it('the full CV still works while locked', () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: 'Show full CV', hidden: true }))
    expect(screen.getByRole('dialog', { name: 'Natalia Troinich' })).toBeInTheDocument()
  })

  it('asks "Btw, cookie?" on top of the CV after "No, I\'ll wait" for new visitors', () => {
    arrive(NOV_19, { answered: false })
    fireEvent.click(screen.getByRole('button', { name: "No, I'll wait" }))
    expect(screen.getByRole('dialog', { name: 'Btw, cookie?' })).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Natalia Troinich' })).toBeInTheDocument()
  })

  it("building the snowman in 3 clicks unlocks the calendar for good and highlights today's door", () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: "Yes, let's do it! ⛄" }))
    expect(screen.getByRole('dialog', { name: 'Build a snowman' })).toBeInTheDocument()

    expect(screen.getByRole('img', { name: /snowy winter forest/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Roll some snow' }))
    expect(screen.getByRole('img', { name: /twig arms, still without his hat/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Find buttons' }))
    expect(screen.getByRole('img', { name: /three coal buttons/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Dress him up' }))
    // straight to the win screen: no in-between state with a Back or empty button
    expect(screen.queryByRole('button', { name: '← Back' })).not.toBeInTheDocument()

    const done = screen.getByRole('dialog', { name: "You've built your way in!" })
    expect(done.querySelector('img')).toHaveAttribute('src', '/snowman.jpg')
    fireEvent.click(screen.getByRole('button', { name: /Open the calendar/ }))
    act(() => vi.advanceTimersByTime(100))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.getElementById('door-19')).toHaveClass('is-highlighted')
    expect(document.getElementById('door-19')).not.toHaveClass('is-open')
    expect(localStorage.getItem('meet-me:unlocked')).toBe('1')
  })

  it('all doors are closed while locked and after unlocking, even if some were open before', () => {
    localStorage.setItem('amazing-me:opened-doors', JSON.stringify([1, 2, 3, 19]))
    arrive(NOV_19)
    expect(document.querySelectorAll('.door.is-open')).toHaveLength(0)
    expect(screen.getByText(/\/ 24 opened/, { ignore: false }).textContent).toMatch(/^0 \/ 24 opened/)

    fireEvent.click(screen.getByRole('button', { name: "Yes, let's do it! ⛄" }))
    fireEvent.click(screen.getByRole('button', { name: 'Roll some snow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Find buttons' }))
    fireEvent.click(screen.getByRole('button', { name: 'Dress him up' }))
    act(() => vi.advanceTimersByTime(1000))
    fireEvent.click(screen.getByRole('button', { name: /Open the calendar/ }))
    act(() => vi.advanceTimersByTime(100))

    expect(document.querySelectorAll('.door.is-open')).toHaveLength(0)
    expect(screen.getByText(/\/ 24 opened/).textContent).toMatch(/^0 \/ 24 opened/)
  })

  it('"Back" goes one step back, and from the first step back to "Too early!"', () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: "Yes, let's do it! ⛄" }))
    fireEvent.click(screen.getByRole('button', { name: 'Roll some snow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Find buttons' }))
    expect(screen.getByRole('img', { name: /three coal buttons/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '← Back' }))
    expect(screen.getByRole('img', { name: /twig arms, still without his hat/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Find buttons' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '← Back' }))
    expect(screen.getByRole('img', { name: /snowy winter forest/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '← Back' }))
    expect(screen.getByRole('dialog', { name: 'Too early!' })).toBeInTheDocument()
  })

  it('a visitor who already built the snowman is not locked out again', () => {
    localStorage.setItem('meet-me:unlocked', '1')
    arrive(NOV_19)
    expect(screen.queryByRole('dialog', { name: 'Too early!' })).not.toBeInTheDocument()
    expect(document.getElementById('door-19')).toHaveClass('is-highlighted')
  })

  it('is never locked in December', () => {
    arrive(new Date(2026, 11, 1))
    expect(screen.queryByRole('dialog', { name: 'Too early!' })).not.toBeInTheDocument()
  })
})
