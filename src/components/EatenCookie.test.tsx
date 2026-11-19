import { render } from '@testing-library/react'
import { EatenCookie } from './EatenCookie'

describe('EatenCookie', () => {
  it('draws the default cookie without an image', () => {
    const { container } = render(<EatenCookie reducedMotion={false} image="" />)
    expect(container.querySelector('image')).toBeNull()
  })

  it('uses a custom picture from public/', () => {
    const { container } = render(<EatenCookie reducedMotion={false} image="my-cookie.png" />)
    expect(container.querySelector('image')?.getAttribute('href')).toBe('/my-cookie.png')
  })
})
