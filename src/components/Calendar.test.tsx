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

  it("on phones: today's door first, then 1, 2, 3… in order", () => {
    setPhone(true)
    renderCalendar(5)
    expect(doorIds()).toEqual([5, 1, 2, 3, 4, ...Array.from({ length: 19 }, (_, i) => i + 6)])
    // door 5 would sit alone next to wide door 1, so it fills its row
    expect(document.getElementById('door-5')).toHaveClass('door--phone-full')
    expect(document.getElementById('door-2')).not.toHaveClass('door--phone-full')
  })

  it('on wider screens: the shuffled advent order', () => {
    setPhone(false)
    renderCalendar(5)
    expect(doorIds()).toEqual(orderWithTodayFirst(gridOrder, 5))
    expect(document.querySelector('.door--phone-full')).toBeNull()
  })
})
