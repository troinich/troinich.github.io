import { render, screen } from '@testing-library/react'
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
    expect(screen.queryByRole('heading', { name: 'Happy 7' })).not.toBeInTheDocument()

    await userEvent.click(button)
    expect(screen.getByRole('button', { name: 'Door 7, open' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('heading', { name: 'Happy 7' })).toBeInTheDocument()
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

describe('Door (today)', () => {
  it('shows a Today badge and mentions it in the label', () => {
    render(
      <ul>
        <Door door={doorById.get(19)!} open={false} today onToggle={() => {}} onReadMore={() => {}} />
      </ul>,
    )
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Door 19 (today), closed' })).toBeInTheDocument()
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
