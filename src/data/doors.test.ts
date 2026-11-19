import { doors, gridOrder } from './doors'

describe('doors data', () => {
  it('has exactly 24 doors with unique ids 1–24', () => {
    const ids = doors.map((d) => d.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
  })

  it('grid order is a shuffled permutation of 1–24', () => {
    expect([...gridOrder].sort((a, b) => a - b)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
    expect(gridOrder).not.toEqual([...gridOrder].sort((a, b) => a - b))
  })

  it('every door has a headline and description', () => {
    for (const d of doors) {
      expect(d.headline.trim()).not.toBe('')
      expect(d.description.trim()).not.toBe('')
    }
  })
})

describe('door details', () => {
  it('every door has at least two detail points and one tag', () => {
    for (const d of doors) {
      expect(d.details.length).toBeGreaterThanOrEqual(2)
      expect(d.tags.length).toBeGreaterThanOrEqual(1)
    }
  })
})
