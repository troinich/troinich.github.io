import { render, screen } from '@testing-library/react'
import { HireMeButtons } from './HireMeButtons'

const CAL = 'https://cal.com/example/intro'

describe('HireMeButtons', () => {
  it('without a booking page, Email me is the main (gold) button', () => {
    render(<HireMeButtons bookingUrl="" />)
    expect(screen.queryByRole('link', { name: 'Book a call' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Email me' })).toHaveClass('btn--primary')
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
  })

  it('with a booking page, Book a call comes first and Email me becomes secondary', () => {
    render(<HireMeButtons bookingUrl={CAL} />)
    const book = screen.getByRole('link', { name: 'Book a call' })
    expect(book).toHaveAttribute('href', CAL)
    expect(book).toHaveAttribute('target', '_blank')
    expect(book).toHaveClass('btn--primary')
    expect(screen.getByRole('button', { name: 'Email me' })).toHaveClass('btn--secondary')
  })

  it('mainOnly shows just the main button', () => {
    const { unmount } = render(<HireMeButtons mainOnly bookingUrl="" />)
    expect(screen.getByRole('button', { name: 'Email me' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'LinkedIn' })).not.toBeInTheDocument()
    unmount()

    render(<HireMeButtons mainOnly bookingUrl={CAL} onShowCv={() => {}} />)
    expect(screen.getByRole('link', { name: 'Book a call' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Email me' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Full CV' })).not.toBeInTheDocument()
  })

  it('linkedin={false} leaves LinkedIn out', () => {
    render(<HireMeButtons linkedin={false} bookingUrl={CAL} />)
    expect(screen.queryByRole('link', { name: 'LinkedIn' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Email me' })).toBeInTheDocument()
  })

  it('pdf adds its button, but not with mainOnly', () => {
    const { unmount } = render(<HireMeButtons pdf bookingUrl={CAL} />)
    expect(screen.getByRole('link', { name: 'Download CV (PDF)' })).toHaveAttribute('download')
    unmount()
    render(<HireMeButtons pdf mainOnly bookingUrl={CAL} />)
    expect(screen.queryByRole('link', { name: 'Download CV (PDF)' })).not.toBeInTheDocument()
  })

  it('intro variant: only Book a call (pulsing), Email me and Download CV, all gold outline', () => {
    render(<HireMeButtons variant="intro" pdf bookingUrl={CAL} />)
    expect(screen.getByRole('link', { name: 'Book a call' })).toHaveClass('btn--secondary', 'btn--pulse')
    expect(screen.getByRole('button', { name: 'Email me' })).toHaveClass('btn--secondary')
    expect(screen.getByRole('button', { name: 'Email me' })).not.toHaveClass('btn--pulse')
    const pdf = screen.getByRole('link', { name: 'Download CV (PDF)' })
    expect(pdf).toHaveAttribute('download')
    expect(pdf).toHaveTextContent('Download CV')
    expect(screen.queryByRole('link', { name: 'LinkedIn' })).not.toBeInTheDocument()
  })
})
