import { fireEvent, render, screen } from '@testing-library/react'
import { Header } from './Header'

const noop = () => {}

function renderHeader(props: Partial<Parameters<typeof Header>[0]> = {}) {
  return render(
    <Header
      openedCount={0}
      total={24}
      muted={false}
      onToggleMuted={noop}
      onOpenAll={noop}
      onCloseAll={noop}
      onShowCv={noop}
      {...props}
    />,
  )
}

describe('Header', () => {
  it('the bell is an SVG icon (not an emoji) and shows whether the jingle is on', () => {
    const { rerender } = renderHeader({ muted: false })
    const bell = screen.getByRole('button', { name: 'Jingle sound' })
    expect(bell).toHaveAttribute('aria-pressed', 'true')
    expect(bell).toHaveAttribute('title', 'Turn jingle off')
    expect(bell.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(bell).not.toHaveTextContent(/🔔|🔕/u)
    const onIcon = bell.querySelector('svg')!.innerHTML

    rerender(
      <Header
        openedCount={0}
        total={24}
        muted
        onToggleMuted={noop}
        onOpenAll={noop}
        onCloseAll={noop}
        onShowCv={noop}
      />,
    )
    expect(bell).toHaveAttribute('aria-pressed', 'false')
    expect(bell).toHaveAttribute('title', 'Turn jingle on')
    expect(bell.querySelector('svg')!.innerHTML).not.toBe(onIcon) // the crossed-out bell
  })

  it('clicking the bell toggles the jingle', () => {
    const onToggleMuted = vi.fn()
    renderHeader({ onToggleMuted })
    fireEvent.click(screen.getByRole('button', { name: 'Jingle sound' }))
    expect(onToggleMuted).toHaveBeenCalledOnce()
  })

  it('the bell and the counter sit together, so they wrap as one', () => {
    renderHeader({ openedCount: 3 })
    const bell = screen.getByRole('button', { name: 'Jingle sound' })
    expect(bell.parentElement).toHaveTextContent('3 / 24 opened')
  })

  it('says Ho ho ho! when every door is open', () => {
    renderHeader({ openedCount: 24 })
    const counter = screen.getByRole('button', { name: 'Jingle sound' }).nextElementSibling
    expect(counter).toHaveTextContent('24 / 24 opened · Ho ho ho!')
  })

  it('the intro offers "Hiring? Let\'s talk." with my booking page, but not the availability line', () => {
    renderHeader()
    expect(screen.getByText("Hiring? Let's talk.")).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Book a call' })).toHaveAttribute('href', 'https://cal.com/troinich')
    expect(screen.queryByText('Notice period: 1 month')).not.toBeInTheDocument()
  })

  it('calendar controls are quiet pills; nothing in the header is filled gold', () => {
    renderHeader({ openedCount: 1, onGoToToday: noop })
    for (const name of ['Open all doors', 'Close all doors', "Go to today's door", 'Show full CV']) {
      expect(screen.getByRole('button', { name })).toHaveClass('btn--quiet')
    }
    expect(document.querySelectorAll('.btn--primary')).toHaveLength(0)
  })
})
