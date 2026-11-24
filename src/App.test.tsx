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

  it("does not scroll the page to today's door (on any screen)", () => {
    const scroll = vi.fn()
    Element.prototype.scrollIntoView = scroll
    arrive(DEC_5)
    act(() => vi.advanceTimersByTime(3000))
    expect(scroll).not.toHaveBeenCalled()
  })
})

describe('Phones: "Go to today\'s door" shortcut', () => {
  it("scrolls to today's door but leaves it closed", () => {
    const scroll = vi.fn()
    Element.prototype.scrollIntoView = scroll
    arrive(DEC_5)
    act(() => vi.advanceTimersByTime(5000)) // the arrival pulse is over
    expect(document.getElementById('door-5')).not.toHaveClass('is-highlighted')
    fireEvent.click(screen.getByRole('button', { name: "Go to today's door" }))
    expect(scroll).toHaveBeenCalledTimes(1)
    expect(scroll.mock.contexts[0]).toBe(document.getElementById('door-5'))
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByRole('button', { name: 'Door 5 (today), closed' })).toHaveAttribute('aria-expanded', 'false')
    // it pulses again, since the arrival pulse played while it was off-screen
    expect(document.getElementById('door-5')).toHaveClass('is-highlighted')
    act(() => vi.advanceTimersByTime(5000))
    expect(document.getElementById('door-5')).not.toHaveClass('is-highlighted')
  })

  it("pulses only once today's door is on screen, not while it is further down", () => {
    // a stand-in for the browser's IntersectionObserver that lets the test say when the door shows up
    let show: (visible: boolean) => void = () => {}
    const original = window.IntersectionObserver
    const originalMatchMedia = window.matchMedia
    window.matchMedia = ((query: string) => ({
      matches: query.includes('max-width: 639px'), // a phone
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia
    window.IntersectionObserver = class {
      constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
        show = (visible) => act(() => cb([{ isIntersecting: visible }]))
      }
      observe() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver
    try {
      arrive(DEC_5)
      const door = document.getElementById('door-5')!
      act(() => vi.advanceTimersByTime(5000))
      expect(door).not.toHaveClass('is-highlighted') // still off-screen: no pulse yet
      show(true) // the visitor scrolls down to it
      expect(door).toHaveClass('is-highlighted')
      act(() => vi.advanceTimersByTime(5000))
      expect(door).not.toHaveClass('is-highlighted')
    } finally {
      window.IntersectionObserver = original
      window.matchMedia = originalMatchMedia
    }
  })

  it('is not shown while the calendar is locked', () => {
    arrive(NOV_19)
    expect(screen.queryByRole('button', { name: /today's door/ })).not.toBeInTheDocument()
  })
})

describe('Cookie question', () => {
  const banner = () => screen.queryByRole('region', { name: 'Btw, cookie?' })

  it('is a small card that appears 4 seconds after arrival, without blocking the page', () => {
    arrive(DEC_5, { answered: false })
    expect(banner()).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(4000))
    expect(banner()).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    // the calendar still works while it's showing
    fireEvent.click(screen.getByRole('button', { name: 'Door 5 (today), closed' }))
    expect(screen.getByRole('button', { name: 'Door 5 (today), open' })).toBeInTheDocument()
  })

  it('appears straight away when the first door is opened', () => {
    arrive(DEC_5, { answered: false })
    fireEvent.click(screen.getByRole('button', { name: 'Door 5 (today), closed' }))
    expect(banner()).toBeInTheDocument()
  })

  it('offers equal "No thanks" and "Sure!" buttons', () => {
    arrive(DEC_5, { answered: false })
    act(() => vi.advanceTimersByTime(4000))
    const no = screen.getByRole('button', { name: 'No thanks' })
    const yes = screen.getByRole('button', { name: 'Sure!' })
    expect(no.className).toBe(yes.className)
  })

  it('"No thanks" sends the gingerbread man to a marshmallow bath, stores the answer and closes itself', () => {
    arrive(DEC_5, { answered: false })
    act(() => vi.advanceTimersByTime(4000))
    fireEvent.click(screen.getByRole('button', { name: 'No thanks' }))
    expect(screen.getByRole('img', { name: /relaxing in a bathtub full of marshmallows/ })).toHaveAttribute(
      'src',
      '/marshmallow-bath.webp',
    )
    expect(document.cookie).toContain('cookie_consent=no')
    act(() => vi.advanceTimersByTime(1900))
    expect(document.querySelector('.cookie-banner--fading')).not.toBeInTheDocument() // still showing
    act(() => vi.advanceTimersByTime(150))
    expect(document.querySelector('.cookie-banner--fading')).toBeInTheDocument() // closing by itself: a plain fade, no dust
    expect(document.querySelector('.dust')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(400)) // gone after 2 seconds plus the short fade
    expect(banner()).not.toBeInTheDocument()
  })

  it('"Sure!" shows the gingerbread man being eaten, stores the answer and closes itself', () => {
    arrive(DEC_5, { answered: false })
    act(() => vi.advanceTimersByTime(4000))
    fireEvent.click(screen.getByRole('button', { name: 'Sure!' }))
    expect(screen.getByRole('img', { name: 'A gingerbread man being eaten' })).toBeInTheDocument()
    expect(document.cookie).toContain('cookie_consent=yes')
    act(() => vi.advanceTimersByTime(2100))
    expect(banner()).not.toBeInTheDocument()
  })

  it('tapping the reaction makes it dissolve straight away', () => {
    arrive(DEC_5, { answered: false })
    act(() => vi.advanceTimersByTime(4000))
    fireEvent.click(screen.getByRole('button', { name: 'No thanks' }))
    fireEvent.click(screen.getByRole('status'))
    expect(document.querySelector('.cookie-banner--dissolving')).toBeInTheDocument() // turning into dust
    act(() => vi.advanceTimersByTime(950))
    expect(document.querySelector('.cookie-banner')).not.toBeInTheDocument()
  })

  it('"Not now" hides it for this visit without saving an answer', () => {
    arrive(DEC_5, { answered: false })
    act(() => vi.advanceTimersByTime(4000))
    fireEvent.click(screen.getByRole('button', { name: 'Not now' }))
    act(() => vi.advanceTimersByTime(950))
    expect(banner()).not.toBeInTheDocument()
    expect(document.cookie).not.toContain('cookie_consent=')
    fireEvent.click(screen.getByRole('button', { name: 'Door 5 (today), closed' }))
    expect(banner()).not.toBeInTheDocument()
  })

  it('is never shown to returning visitors', () => {
    arrive(DEC_5)
    act(() => vi.advanceTimersByTime(5000))
    fireEvent.click(screen.getByRole('button', { name: 'Door 5 (today), closed' }))
    expect(banner()).not.toBeInTheDocument()
  })

  it('is not shown while the calendar is locked, only 3 seconds after the snowman unlocks it', () => {
    arrive(NOV_19, { answered: false })
    act(() => vi.advanceTimersByTime(10_000))
    expect(screen.getByRole('dialog', { name: 'Too early!' })).toBeInTheDocument()
    expect(banner()).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: "Yes, let's do it!" }))
    fireEvent.click(screen.getByRole('button', { name: 'Roll some snow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Find buttons' }))
    fireEvent.click(screen.getByRole('button', { name: 'Dress him up' }))
    expect(banner()).not.toBeInTheDocument() // not during the game either
    fireEvent.click(screen.getByRole('button', { name: /Open the calendar/ }))
    act(() => vi.advanceTimersByTime(2900))
    expect(banner()).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(200))
    expect(banner()).toBeInTheDocument()
  })

  it('"Yes" then "No" from Cookie settings: GoatCounter is switched off and not loaded on the next visit', () => {
    arrive(DEC_5, { answered: false })
    act(() => vi.advanceTimersByTime(4000))
    fireEvent.click(screen.getByRole('button', { name: 'Sure!' }))
    act(() => vi.advanceTimersByTime(2100))
    expect(document.cookie).toContain('cookie_consent=yes')
    expect(document.querySelector('script[data-goatcounter]')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Cookie settings/ }))
    fireEvent.click(screen.getByRole('button', { name: 'No thanks' }))
    expect(document.cookie).toContain('cookie_consent=no')
    expect(document.querySelector('script[data-goatcounter]')).not.toBeInTheDocument()
    expect(localStorage.getItem('skipgc')).toBe('t')
    act(() => vi.advanceTimersByTime(2100))
    cleanup()

    // next visit
    render(<App />)
    expect(document.querySelector('script[data-goatcounter]')).not.toBeInTheDocument()
  })

  it('tapping the reaction just before it closes itself dissolves it only once', () => {
    arrive(DEC_5, { answered: false })
    act(() => vi.advanceTimersByTime(4000))
    fireEvent.click(screen.getByRole('button', { name: 'Sure!' }))
    act(() => vi.advanceTimersByTime(1500))
    fireEvent.click(screen.getByRole('status'))
    const specks = document.querySelectorAll('.dust span').length
    act(() => vi.advanceTimersByTime(600)) // the 2-second auto-close fires while dissolving
    expect(document.querySelectorAll('.dust span').length).toBe(specks) // not restarted
    act(() => vi.advanceTimersByTime(400))
    expect(document.querySelector('.cookie-banner')).not.toBeInTheDocument()
  })

  it('opening Cookie settings while the previous card is fading out shows a fresh question that stays', () => {
    arrive(DEC_5, { answered: false })
    act(() => vi.advanceTimersByTime(4000))
    fireEvent.click(screen.getByRole('button', { name: 'Sure!' }))
    act(() => vi.advanceTimersByTime(2100)) // the reaction has started dissolving
    fireEvent.click(screen.getByRole('button', { name: /Cookie settings/ }))
    act(() => vi.advanceTimersByTime(1000)) // the old card's fade-out timer must not close the new one
    expect(banner()).toBeInTheDocument()
  })

  it('appears on the CV page for visitors who choose "No, I\'ll wait", and steps aside for the game', () => {
    arrive(NOV_19, { answered: false })
    fireEvent.click(screen.getByRole('button', { name: "No, I'll wait" }))
    expect(screen.getByRole('dialog', { name: 'Natalia Troinich' })).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2900))
    expect(banner()).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(200))
    expect(banner()).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Back to calendar/ })) // -> "Too early!" again
    expect(screen.getByRole('dialog', { name: 'Too early!' })).toBeInTheDocument()
    expect(banner()).not.toBeInTheDocument() // hidden while the game is showing
    fireEvent.click(screen.getByRole('button', { name: "No, I'll wait" })) // back to the CV
    expect(banner()).toBeInTheDocument() // still waiting for an answer
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

  it('flips Open all to Close all at once, while the doors are still cascading open', () => {
    arrive(DEC_5)
    const openAll = screen.getByRole('button', { name: /Open all doors/ })
    openAll.focus()
    fireEvent.click(openAll)
    act(() => vi.advanceTimersByTime(100)) // only the first doors are open so far
    expect(screen.getAllByRole('button', { name: /, closed$/ }).length).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { name: /Open all doors/ })).not.toBeInTheDocument()
    const closeAll = screen.getByRole('button', { name: 'Close all doors' })
    expect(closeAll).toHaveFocus()

    fireEvent.click(closeAll) // stops the cascade mid-way
    expect(screen.queryByRole('button', { name: 'Close all doors' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Open all doors/ })).toHaveFocus()
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.queryByRole('button', { name: 'Close all doors' })).not.toBeInTheDocument()
  })
})

describe('Read more', () => {
  it('opens a detail card for an opened door and closes it with Escape', () => {
    arrive(new Date(2026, 11, 10))
    openDoorCard(10, 'Stripe payments, end to end')
    const dialog = screen.getByRole('dialog', { name: 'Stripe payments, end to end' })
    expect(dialog).toHaveTextContent('Set up automated Stripe Tax collection.')
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    // the door stays open behind the card
    expect(screen.getByRole('button', { name: 'Door 10 (today), open', hidden: true })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('Build a snowman (footer replay)', () => {
  it('replays the game straight from the building step and changes nothing', () => {
    arrive(DEC_5)
    fireEvent.click(screen.getByRole('button', { name: 'Door 5 (today), closed' })) // one door open
    fireEvent.click(screen.getByRole('button', { name: 'Build a snowman' }))
    expect(screen.queryByRole('dialog', { name: 'Too early!' })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Build a snowman' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Roll some snow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Find buttons' }))
    fireEvent.click(screen.getByRole('button', { name: 'Dress him up' }))
    expect(screen.getByRole('dialog', { name: 'What a snowman!' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Back to the calendar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    // the door that was open stays open, and nothing was unlocked or reset
    expect(screen.getByRole('button', { name: 'Door 5 (today), open' })).toBeInTheDocument()
    expect(localStorage.getItem('meet-me:unlocked')).toBeNull()
  })

  it('"Back" on the first step closes the replay', () => {
    arrive(DEC_5)
    fireEvent.click(screen.getByRole('button', { name: 'Build a snowman' }))
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('a click outside the card closes the replay; a press that starts on the card does not', () => {
    arrive(DEC_5)
    fireEvent.click(screen.getByRole('button', { name: 'Build a snowman' }))
    const backdrop = screen.getByRole('dialog', { name: 'Build a snowman' }).parentElement!

    fireEvent.pointerDown(screen.getByRole('img', { name: /snowy winter forest/ }))
    fireEvent.click(backdrop) // e.g. a drag that ends outside the card
    expect(screen.getByRole('dialog', { name: 'Build a snowman' })).toBeInTheDocument()

    fireEvent.pointerDown(backdrop)
    fireEvent.click(backdrop)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is not offered while the calendar is locked (the lockout already has the game)', () => {
    arrive(NOV_19)
    expect(screen.queryByRole('button', { name: 'Build a snowman', hidden: true })).not.toBeInTheDocument()
  })
})

describe('Locked before December', () => {
  it('greets the visitor with "Too early!"', () => {
    arrive(NOV_19, { answered: false })
    expect(screen.getByRole('dialog', { name: 'Too early!' })).toHaveTextContent('Welcome to my Advent CV Calendar')
    expect(screen.getByRole('dialog', { name: 'Too early!' })).toHaveTextContent(
      'Build a snowman in 3 clicks to unlock early.',
    )
    expect(screen.getByRole('img', { name: /autumn maple leaf/ })).toBeInTheDocument() // November
  })

  it('a click outside the "Too early!" card does not close it (there is no calendar to go back to)', () => {
    arrive(NOV_19)
    const backdrop = screen.getByRole('dialog', { name: 'Too early!' }).parentElement!
    fireEvent.pointerDown(backdrop)
    fireEvent.click(backdrop)
    expect(screen.getByRole('dialog', { name: 'Too early!' })).toBeInTheDocument()
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

  it('"Open all doors" asks to build the snowman instead', () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: /Open all doors/, hidden: true }))
    expect(screen.getByRole('dialog', { name: 'Too early!' })).toBeInTheDocument()
  })

  it("building the snowman in 3 clicks unlocks the calendar for good and highlights today's door", () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: "Yes, let's do it!" }))
    expect(screen.getByRole('dialog', { name: 'Build a snowman' })).toBeInTheDocument()

    expect(screen.getByRole('img', { name: /snowy winter forest/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Roll some snow' }))
    expect(screen.getByRole('img', { name: /twig arms, still without his hat/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Find buttons' }))
    expect(screen.getByRole('img', { name: /three coal buttons/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Dress him up' }))
    // straight to the win screen: no in-between state with a Back or empty button
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()

    const done = screen.getByRole('dialog', { name: "You've built your way in!" })
    expect(done.querySelector('img')).toHaveAttribute('src', '/snowman.webp')
    fireEvent.click(screen.getByRole('button', { name: /Open the calendar/ }))
    act(() => vi.advanceTimersByTime(100))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.getElementById('door-19')).toHaveClass('is-highlighted')
    expect(document.getElementById('door-19')).not.toHaveClass('is-open')
    expect(localStorage.getItem('meet-me:unlocked')).toBe('1')
  })

  it('all doors are closed while locked and after unlocking, even if some were open before', () => {
    localStorage.setItem('meet-me:opened-doors', JSON.stringify([1, 2, 3, 19]))
    arrive(NOV_19)
    expect(document.querySelectorAll('.door.is-open')).toHaveLength(0)
    expect(screen.getByText(/\/ 24 opened/, { ignore: false }).textContent).toMatch(/^0 \/ 24 opened/)

    fireEvent.click(screen.getByRole('button', { name: "Yes, let's do it!" }))
    fireEvent.click(screen.getByRole('button', { name: 'Roll some snow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Find buttons' }))
    fireEvent.click(screen.getByRole('button', { name: 'Dress him up' }))
    act(() => vi.advanceTimersByTime(1000))
    fireEvent.click(screen.getByRole('button', { name: /Open the calendar/ }))
    act(() => vi.advanceTimersByTime(100))

    expect(document.querySelectorAll('.door.is-open')).toHaveLength(0)
    expect(screen.getByText(/\/ 24 opened/).textContent).toMatch(/^0 \/ 24 opened/)
  })

  it('tapping the picture does not build; only the pieces do', () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: "Yes, let's do it!" }))
    expect(screen.getByRole('dialog', { name: 'Build a snowman' })).toHaveTextContent(
      'Step 1 of 3 · drag the glowing piece onto the picture, or tap it',
    )

    fireEvent.click(screen.getByRole('img', { name: /snowy winter forest/ }))
    expect(screen.getByRole('img', { name: /snowy winter forest/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Roll some snow' }))
    expect(screen.getByRole('img', { name: /twig arms, still without his hat/ })).toBeInTheDocument()
  })

  it('shows a 👆 drag hint on step 1 that goes away on the first touch and does not come back', () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: "Yes, let's do it!" }))
    expect(document.querySelector('.drag-hint')).toBeInTheDocument()
    fireEvent.pointerDown(window)
    expect(document.querySelector('.drag-hint')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    fireEvent.click(screen.getByRole('button', { name: "Yes, let's do it!" }))
    expect(document.querySelector('.drag-hint')).not.toBeInTheDocument()
  })

  it('the tray shows done, current and upcoming pieces; only the current one can be used', () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: "Yes, let's do it!" }))
    expect(screen.getByRole('button', { name: 'Roll some snow' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Find buttons' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Dress him up' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Roll some snow' }))
    act(() => vi.advanceTimersByTime(10))
    expect(screen.getByRole('button', { name: 'Roll some snow' })).toBeDisabled() // done
    expect(screen.getByRole('button', { name: 'Find buttons' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Find buttons' })).toHaveFocus()
  })

  it('dragging the glowing piece onto the picture builds the next step; dropping elsewhere does nothing', () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: "Yes, let's do it!" }))
    const picture = screen.getByRole('img', { name: /snowy winter forest/ })
    picture.getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 300, bottom: 300, width: 300, height: 300, x: 0, y: 0, toJSON() {} }) as DOMRect

    const piece = screen.getByRole('button', { name: 'Roll some snow' })
    // dropped outside the picture: nothing happens
    fireEvent.pointerDown(piece, { clientX: 150, clientY: 500, pointerId: 1 })
    fireEvent.pointerMove(piece, { clientX: 150, clientY: 450, pointerId: 1 })
    fireEvent.pointerUp(piece, { clientX: 150, clientY: 450, pointerId: 1 })
    fireEvent.click(piece) // the click that follows a drag is ignored
    act(() => vi.advanceTimersByTime(10))
    expect(screen.getByRole('img', { name: /snowy winter forest/ })).toBeInTheDocument()

    // dropped onto the picture: the snowman appears
    fireEvent.pointerDown(piece, { clientX: 150, clientY: 500, pointerId: 1 })
    fireEvent.pointerMove(piece, { clientX: 150, clientY: 150, pointerId: 1 })
    fireEvent.pointerUp(piece, { clientX: 150, clientY: 150, pointerId: 1 })
    expect(screen.getByRole('img', { name: /twig arms, still without his hat/ })).toBeInTheDocument()
  })

  it('"Back" goes one step back, and from the first step back to "Too early!"', () => {
    arrive(NOV_19)
    fireEvent.click(screen.getByRole('button', { name: "Yes, let's do it!" }))
    fireEvent.click(screen.getByRole('button', { name: 'Roll some snow' }))
    fireEvent.click(screen.getByRole('button', { name: 'Find buttons' }))
    expect(screen.getByRole('img', { name: /three coal buttons/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('img', { name: /twig arms, still without his hat/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Find buttons' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('img', { name: /snowy winter forest/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('dialog', { name: 'Too early!' })).toBeInTheDocument()
  })


  it('a visitor who already built the snowman is not locked out again', () => {
    localStorage.setItem('meet-me:unlocked', '1')
    arrive(NOV_19)
    expect(screen.queryByRole('dialog', { name: 'Too early!' })).not.toBeInTheDocument()
    expect(document.getElementById('door-19')).toHaveClass('is-highlighted')
  })
})
