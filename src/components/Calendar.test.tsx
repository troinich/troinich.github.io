import { render, screen, within } from '@testing-library/react'
import { gridOrder, orderWithTodayFirst } from '../data/doors'
import { Calendar } from './Calendar'

/** Makes `(max-width: 639px)` match (a phone) or not. */
function setPhone(phone: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: phone && query.includes('max-width: 639px'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
}

const doorIds = () =>
  within(screen.getByRole('list', { name: /advent calendar/i }))
    .getAllByRole('listitem')
    .filter((li) => li.id.startsWith('door-'))
    .map((li) => Number(li.id.slice('door-'.length)))

const renderCalendar = (todayId: number) =>
  render(<Calendar opened={new Set()} todayId={todayId} onToggle={() => {}} onReadMore={() => {}} />)

describe('Calendar order', () => {
  const original = window.matchMedia
  afterEach(() => {
    window.matchMedia = original
  })

  it("on phones: 1, 2, 3… 24 in order, with today's door highlighted in place", () => {
    setPhone(true)
    renderCalendar(19)
    expect(doorIds()).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
    expect(document.getElementById('door-19')).toHaveClass('is-today')
    // door 11 would sit alone between wide doors 10 and 12, so it fills its row
    expect(document.getElementById('door-11')).toHaveClass('door--phone-full')
    expect(document.getElementById('door-2')).not.toHaveClass('door--phone-full')
  })

  it('on wider screens: the shuffled advent order', () => {
    setPhone(false)
    renderCalendar(5)
    expect(doorIds()).toEqual(orderWithTodayFirst(gridOrder, 5))
    expect(document.querySelector('.door--phone-full')).toBeNull()
  })
})
