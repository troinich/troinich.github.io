import { isMuted, setMuted } from './sound'

describe('sound', () => {
  it('is on by default and remembers mute', () => {
    expect(isMuted()).toBe(false)
    setMuted(true)
    expect(isMuted()).toBe(true)
  })

})
