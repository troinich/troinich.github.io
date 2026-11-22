import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Door } from './Door'
import { doorById } from '../data/doors'

function Harness() {
  const [open, setOpen] = useState(false)
  return (
    <ul>
      <Door door={doorById.get(7)!} open={open} onToggle={() => setOpen((o) => !o)} onReadMore={() => {}} />
    </ul>
  )
}

describe('Door', () => {
  it('opens on click and updates aria-expanded', async () => {
    render(<Harness />)
    const button = screen.getByRole('button', { name: 'Door 7, closed' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('heading', { name: '7+ years in production' })).not.toBeInTheDocument()

    await userEvent.click(button)
    expect(screen.getByRole('button', { name: 'Door 7, open' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('heading', { name: '7+ years in production' })).toBeInTheDocument()
  })

  it('toggles with Enter and Space', async () => {
    render(<Harness />)
    const button = screen.getByRole('button', { name: /Door 7/ })
    button.focus()
    await userEvent.keyboard('{Enter}')
    expect(button).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard(' ')
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('Door (Read more)', () => {
  const stripeDoor = doorById.get(10)! // wide door: some details stay hidden, so it has "Read more"

  it('"Read more" opens the details and does not close the door', async () => {
    const onToggle = vi.fn()
    const onReadMore = vi.fn()
    render(
      <ul>
        <Door door={stripeDoor} open onToggle={onToggle} onReadMore={onReadMore} />
      </ul>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Read more about Stripe payments, end to end' }))
    expect(onReadMore).toHaveBeenCalledWith(10)
    expect(onToggle).not.toHaveBeenCalled()
  })

  it('clicking the open card itself closes the door', async () => {
    const onToggle = vi.fn()
    render(
      <ul>
        <Door door={stripeDoor} open onToggle={onToggle} onReadMore={() => {}} />
      </ul>,
    )
    await userEvent.click(screen.getByRole('heading', { name: 'Stripe payments, end to end' }))
    expect(onToggle).toHaveBeenCalledWith(10)
  })
})

describe('Door 24 (open)', () => {
  const realLocation = window.location
  let hrefs: string[]
  beforeEach(() => {
    hrefs = []
    Object.defineProperty(window, 'location', {
      value: {
        ...realLocation,
        set href(v: string) {
          hrefs.push(v)
        },
      },
      configurable: true,
    })
  })
  afterEach(() => {
    Object.defineProperty(window, 'location', { value: realLocation, configurable: true })
    vi.useRealTimers()
  })

  function renderOpenDoor24(onToggle = vi.fn()) {
    render(
      <ul>
        <Door door={doorById.get(24)!} open onToggle={onToggle} onReadMore={() => {}} />
      </ul>,
    )
    return onToggle
  }

  it('"Email me" opens an email to the CV address and does not close the door', () => {
    const onToggle = renderOpenDoor24()
    fireEvent.click(screen.getByRole('button', { name: /Email me/ }))
    expect(hrefs[0]).toMatch(new RegExp(`^mailto:${atob('dHJvaW5pY3pAZ21haWwuY29t')}\\?`))
    expect(onToggle).not.toHaveBeenCalled()
  })

  it('if no email app opens, copies the address and says "Email copied"', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    renderOpenDoor24()
    fireEvent.click(screen.getByRole('button', { name: /Email me/ }))
    await act(async () => {
      vi.advanceTimersByTime(1300)
    })
    expect(writeText).toHaveBeenCalledWith(atob('dHJvaW5pY3pAZ21haWwuY29t'))
    expect(screen.getByRole('button', { name: '✓ Email copied' })).toBeInTheDocument()
    await act(async () => {
      vi.advanceTimersByTime(3100)
    })
    expect(screen.getByRole('button', { name: /Email me/ })).toBeInTheDocument()
  })

  it('does not copy when the email app takes over the window', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    renderOpenDoor24()
    fireEvent.click(screen.getByRole('button', { name: /Email me/ }))
    fireEvent.blur(window)
    await act(async () => {
      vi.advanceTimersByTime(1300)
    })
    expect(writeText).not.toHaveBeenCalled()
  })
})
