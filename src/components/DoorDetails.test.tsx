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
  it('says "hire me", shows the notice period and the photo', () => {
    render(<DoorDetails door={doorById.get(24)!} onClose={() => {}} onShowCv={() => {}} />)
    const dialog = document.querySelector('[role="dialog"]')!
    expect(dialog).toHaveTextContent('All I want for Christmas is a new challenge')
    expect(dialog).toHaveTextContent('Notice period: 1 month')
    expect(dialog.querySelector('img[alt="Natalia Troinich"]')).toHaveAttribute('src', '/me.jpg')
  })
})

describe('Door 24 category', () => {
  it('has no category tag', () => {
    render(<DoorDetails door={doorById.get(24)!} onClose={() => {}} onShowCv={() => {}} />)
    const dialog = document.querySelector('[role="dialog"]')!
    expect(dialog).not.toHaveTextContent('Achievement')
    expect(dialog).toHaveTextContent('Door 24')
  })
})

describe('Door 24 hire-me buttons', () => {
  it('shows "Email me" and LinkedIn, without writing the email address on the page', () => {
    const { container } = render(<DoorDetails door={doorById.get(24)!} onClose={() => {}} onShowCv={() => {}} />)
    expect(container.querySelector('button')).toBeInTheDocument()
    const email = [...container.querySelectorAll('button')].find((b) => b.textContent?.includes('Email me'))
    expect(email).toBeDefined()
    const linkedin = [...container.querySelectorAll('a')].find((a) => a.textContent === 'LinkedIn')
    expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/troinicz')
    const fullCv = [...container.querySelectorAll('button')].find((b) => b.textContent === 'Full CV')
    expect(fullCv).toBeDefined()
    expect(container.innerHTML).not.toContain('@gmail.com')
    expect(container.innerHTML).not.toContain('mailto:')
  })

  it('other doors have no hire-me buttons', () => {
    const { container } = render(<DoorDetails door={doorById.get(3)!} onClose={() => {}} onShowCv={() => {}} />)
    expect(container).not.toHaveTextContent('Email me')
  })
})
