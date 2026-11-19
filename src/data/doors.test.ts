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

describe('grid fill', () => {
  it('the doors take up a multiple of 12 grid cells, so rows of 2, 3, 4 or 6 have no gaps', () => {
    const cells = doors.reduce((sum, d) => sum + (d.size === 'big' ? 4 : d.size ? 2 : 1), 0)
    expect(cells % 12).toBe(0)
  })
})
