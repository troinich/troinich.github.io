import { render, screen } from '@testing-library/react'
import { SeasonIcon, seasonOf } from './SeasonIcon'

describe('seasonOf', () => {
  it.each([
    [8, 'autumn'], [9, 'autumn'], [10, 'autumn'],
    [0, 'winter'], [1, 'winter'],
    [2, 'spring'], [3, 'spring'], [4, 'spring'],
    [5, 'summer'], [6, 'summer'], [7, 'summer'],
  ] as const)('month %i is %s', (month, season) => {
    expect(seasonOf(new Date(2026, month, 15))).toBe(season)
  })
})

describe('SeasonIcon', () => {
  it.each([
    ['autumn', /autumn maple leaf/, '/seasons/autumn.png'],
    ['winter', /kitten asleep/, '/seasons/winter.jpg'],
    ['spring', /Snowdrops/, '/seasons/spring.jpg'],
    ['summer', /beach umbrella/, '/seasons/summer.jpg'],
  ] as const)('%s shows the right picture', (season, alt, src) => {
    render(<SeasonIcon season={season} />)
    expect(screen.getByRole('img', { name: alt })).toHaveAttribute('src', src)
  })
})
