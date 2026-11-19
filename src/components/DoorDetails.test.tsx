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
    render(<App />) // arrival card has not opened yet
    expect(document.querySelector('.snow')).not.toBeInTheDocument()
    document.cookie = 'cookie_consent=; max-age=0; path=/'
  })
})
