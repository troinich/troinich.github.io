import { act, fireEvent, render, screen } from '@testing-library/react'
import App from './App'

/** After arrival, today's "Read more" card is open on top; close it to use the calendar. */
function closeTodayCard() {
  fireEvent.keyDown(document, { key: 'Escape' })
}

function clearCookie() {
  document.cookie = 'cookie_consent=; max-age=0; path=/'
}

describe('App', () => {
  afterEach(() => {
    vi.useRealTimers()
    clearCookie()
  })

  it('asks "Cookie?" first, and opens today\'s door after "No"', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 11, 5))
    render(<App />)
    expect(screen.getByRole('dialog', { name: 'Cookie?' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'No' }))
    expect(screen.getByRole('img', { name: 'A broken cookie' })).toHaveAttribute('src', '/broken%20cookie.avif')
    expect(document.cookie).toContain('cookie_consent=no')
    act(() => vi.advanceTimersByTime(2300))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(3000))
    closeTodayCard()
    expect(screen.getByRole('button', { name: 'Door 5 (today), open' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/\/ 24 opened/).textContent).toMatch(/^1 \/ 24 opened/)
  })

  it('shows the cookie being eaten after "Yes", then continues', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 11, 5))
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Yes!' }))
    expect(screen.getByRole('img', { name: 'A cookie being eaten' })).toBeInTheDocument()
    expect(document.cookie).toContain('cookie_consent=yes')

    act(() => vi.advanceTimersByTime(4000))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(3000))
    closeTodayCard()
    expect(screen.getByRole('button', { name: 'Door 5 (today), open' })).toBeInTheDocument()
  })

  it('skips the question for returning visitors and opens door 24 on the 25th–31st', () => {
    document.cookie = 'cookie_consent=no; path=/'
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 11, 28))
    render(<App />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(3000))
    closeTodayCard()
    expect(screen.getByRole('button', { name: 'Door 24 (today), open' })).toBeInTheDocument()
  })

  it('reopens the question from Cookie settings', () => {
    document.cookie = 'cookie_consent=no; path=/'
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Cookie settings/ }))
    expect(screen.getByRole('dialog', { name: 'Cookie?' })).toBeInTheDocument()
  })
})

describe('Open all / Close all buttons', () => {
  afterEach(() => {
    document.cookie = 'cookie_consent=; max-age=0; path=/'
  })

  it('shows Open all only when nothing is open, both when some are, Close all only when all are', () => {
    document.cookie = 'cookie_consent=no; path=/'
    vi.useFakeTimers()
    render(<App />)
    // Before today's door opens: nothing open
    expect(screen.getByRole('button', { name: /Open all doors/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close all doors' })).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(3000))
    closeTodayCard() // today's door opens
    expect(screen.getByRole('button', { name: /Open all doors/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close all doors' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Open all doors/ }))
    act(() => vi.advanceTimersByTime(3000))
    closeTodayCard()
    expect(screen.queryByRole('button', { name: /Open all doors/ })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close all doors' }))
    expect(screen.queryByRole('button', { name: 'Close all doors' })).not.toBeInTheDocument()
    vi.useRealTimers()
  })
})

describe('Read more', () => {
  afterEach(() => {
    document.cookie = 'cookie_consent=; max-age=0; path=/'
    vi.useRealTimers()
  })

  it('opens a detail card for an opened door and closes it with Escape', () => {
    document.cookie = 'cookie_consent=no; path=/'
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 11, 10))
    render(<App />)
    act(() => vi.advanceTimersByTime(3000))
    closeTodayCard() // door 10 opens as today's door

    fireEvent.click(screen.getByRole('button', { name: 'Read more about Stripe payments, end to end' }))
    const dialog = screen.getByRole('dialog', { name: 'Stripe payments, end to end' })
    expect(dialog).toHaveTextContent('Set up automated Stripe Tax collection.')
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    // the door stays open behind the card
    expect(screen.getByRole('button', { name: 'Door 10 (today), open', hidden: true })).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('Arrival', () => {
  afterEach(() => {
    document.cookie = 'cookie_consent=; max-age=0; path=/'
    vi.useRealTimers()
  })

  function arrive() {
    document.cookie = 'cookie_consent=no; path=/'
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 11, 5))
    render(<App />)
    act(() => vi.advanceTimersByTime(3000))
  }

  it("opens today's door and shows its Read more card", () => {
    arrive()
    const dialog = screen.getByRole('dialog', { name: 'TypeScript migration' })
    expect(dialog).toHaveTextContent('Today')
    expect(dialog).toHaveTextContent('Door 5')
    expect(document.getElementById('door-5')).toHaveClass('is-open')
  })

  it('closing the card leaves the door open', () => {
    arrive()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Door 5 (today), open' })).toHaveAttribute('aria-expanded', 'true')
  })
})
