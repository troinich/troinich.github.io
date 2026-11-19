import { act, fireEvent, render, screen } from '@testing-library/react'
import { BackToTop } from './BackToTop'

describe('BackToTop (↑ / ↓ on phones)', () => {
  const page = (scrollY: number, scrollHeight = 5000, innerHeight = 800) => {
    Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: innerHeight, configurable: true })
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: scrollHeight, configurable: true })
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
  }
  const up = () => screen.queryByRole('button', { name: 'Back to top' })
  const down = () => screen.queryByRole('button', { name: 'Go to bottom' })

  afterEach(() => page(0))

  it('shows ↓ at the top, both in the middle, and ↑ at the bottom', () => {
    render(<BackToTop reducedMotion={false} />)
    page(0)
    expect([!!up(), !!down()]).toEqual([false, true])
    page(2000)
    expect([!!up(), !!down()]).toEqual([true, true])
    page(4200) // bottom of a 5000px page in an 800px window
    expect([!!up(), !!down()]).toEqual([true, false])
  })

  it('scrolls smoothly to the top or the bottom', () => {
    const spy = vi.fn()
    window.scrollTo = spy as unknown as typeof window.scrollTo
    render(<BackToTop reducedMotion={false} />)
    page(2000)
    fireEvent.click(up()!)
    expect(spy).toHaveBeenLastCalledWith({ top: 0, behavior: 'smooth' })
    fireEvent.click(down()!)
    expect(spy).toHaveBeenLastCalledWith({ top: 5000, behavior: 'smooth' })
  })
})
