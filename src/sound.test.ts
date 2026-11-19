import { isMuted, jingle, setMuted } from './sound'

describe('sound', () => {
  it('is on by default and remembers mute', () => {
    expect(isMuted()).toBe(false)
    setMuted(true)
    expect(isMuted()).toBe(true)
  })

  it('does nothing (and does not crash) without Web Audio', () => {
    expect(() => jingle()).not.toThrow()
  })
})
