import { render } from '@testing-library/react'
import App from '../App'
import { DoorDetails } from './DoorDetails'
import { doorById } from '../data/doors'

describe('Snow', () => {
  it('falls inside an open door card', () => {
    const { container } = render(<DoorDetails door={doorById.get(3)!} onClose={() => {}} onShowCv={() => {}} />)
    expect(container.querySelector('.snow')).toBeInTheDocument()
  })

  it('is not on the page while no card is open', () => {
    document.cookie = 'cookie_consent=no; path=/'
    localStorage.setItem('meet-me:unlocked', '1')
    render(<App />) // arrival card has not opened yet
    expect(document.querySelector('.snow')).not.toBeInTheDocument()
    document.cookie = 'cookie_consent=; max-age=0; path=/'
  })
})

describe('Door 24', () => {
  it('is the "hire me" door: headline, notice period, photo, contact buttons, no email address in the page', () => {
    const { container } = render(<DoorDetails door={doorById.get(24)!} onClose={() => {}} onShowCv={() => {}} />)
    const dialog = container.querySelector('[role="dialog"]')!
    expect(dialog).toHaveTextContent('All I want for Christmas is a new challenge')
    expect(dialog).toHaveTextContent('Notice period: 1 month')
    expect(dialog.querySelector('img[alt="Natalia Troinich"]')).toHaveAttribute('src', '/me.jpg')
    expect([...dialog.querySelectorAll('button')].some((b) => b.textContent?.includes('Email me'))).toBe(true)
    expect([...dialog.querySelectorAll('button')].some((b) => b.textContent === 'Full CV')).toBe(true)
    expect(dialog.querySelector('a[href="https://www.linkedin.com/in/troinicz"]')).toBeInTheDocument()
    expect(container.innerHTML).not.toContain('@gmail.com')
    expect(container.innerHTML).not.toContain('mailto:')
  })
})
