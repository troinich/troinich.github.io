import { render } from '@testing-library/react'
import { DoorDetails } from './DoorDetails'
import { doorById } from '../data/doors'

describe('Snow', () => {
  it('falls inside an open door card', () => {
    const { container } = render(<DoorDetails door={doorById.get(3)!} onClose={() => {}} onShowCv={() => {}} />)
    expect(container.querySelector('.snow')).toBeInTheDocument()
  })
})

describe('Door 24', () => {
  it('is the "hire me" door: headline, notice period, photo, contact buttons (Download CV, no LinkedIn or Full CV), no email address in the page', () => {
    const { container } = render(<DoorDetails door={doorById.get(24)!} onClose={() => {}} onShowCv={() => {}} />)
    const dialog = container.querySelector('[role="dialog"]')!
    expect(dialog).toHaveTextContent('All I want for Christmas is a new challenge')
    expect(dialog).toHaveTextContent('Notice period: 1 month')
    expect(dialog.querySelector('img[alt="Natalia Troinich"]')).toHaveAttribute('src', '/me.webp')
    expect([...dialog.querySelectorAll('button')].some((b) => b.textContent?.includes('Email me'))).toBe(true)
    expect([...dialog.querySelectorAll('button')].some((b) => b.textContent === 'Full CV')).toBe(false)
    expect(dialog.querySelector('a[download]')).toHaveTextContent(/^CV$/) // with a download icon
    expect(dialog.querySelector('a[href="https://www.linkedin.com/in/troinicz"]')).not.toBeInTheDocument()
    expect(container.innerHTML).not.toContain('@gmail.com')
    expect(container.innerHTML).not.toContain('mailto:')
  })
})
