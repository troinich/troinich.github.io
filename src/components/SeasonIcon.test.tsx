import { render, screen } from '@testing-library/react'
import { SeasonIcon, seasonOf } from './SeasonIcon'

describe('seasons', () => {
  it('maps each month to its season (checking the first and last month of each)', () => {
    const season = (month: number) => seasonOf(new Date(2026, month, 15))
    expect([season(8), season(10)]).toEqual(['autumn', 'autumn'])
    expect([season(0), season(1)]).toEqual(['winter', 'winter'])
    expect([season(2), season(4)]).toEqual(['spring', 'spring'])
    expect([season(5), season(7)]).toEqual(['summer', 'summer'])
  })

  it('shows the right picture for each season', () => {
    const pictures = {
      autumn: 'seasons/autumn.webp',
      winter: 'seasons/winter.webp',
      spring: 'seasons/spring.webp',
      summer: 'seasons/summer.webp',
    }
    for (const [s, src] of Object.entries(pictures)) {
      const { unmount } = render(<SeasonIcon season={s as keyof typeof pictures} />)
      expect(screen.getByRole('img')).toHaveAttribute('src', `/${src}`)
      unmount()
    }
  })
})
