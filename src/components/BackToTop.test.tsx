import { act, fireEvent, render, screen } from '@testing-library/react'
import { BackToTop } from './BackToTop'

describe('BackToTop', () => {
  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })

  function scrollTo(y: number) {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
  }

  it('is hidden at the top and appears after scrolling down', () => {
    render(<BackToTop reducedMotion={false} />)
    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument()
    scrollTo(900)
    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument()
    scrollTo(100)
    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument()
  })

  it('scrolls smoothly to the top when clicked', () => {
    const spy = vi.fn()
    window.scrollTo = spy as unknown as typeof window.scrollTo
    render(<BackToTop reducedMotion={false} />)
    scrollTo(900)
    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }))
    expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
