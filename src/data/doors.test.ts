import { doors, gridOrder, orderWithTodayFirst, phoneFullWidth, phoneOrder } from './doors'

describe('doors data', () => {
  it('has exactly 24 doors with unique ids 1–24', () => {
    const ids = doors.map((d) => d.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
  })

  it('grid order is a shuffled permutation of 1–24', () => {
    expect([...gridOrder].sort((a, b) => a - b)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
    expect(gridOrder).not.toEqual([...gridOrder].sort((a, b) => a - b))
  })

  it('every door has a headline, a description, at least two detail points and a tag', () => {
    for (const d of doors) {
      expect(d.headline.trim()).not.toBe('')
      expect(d.description.trim()).not.toBe('')
      expect(d.details.length).toBeGreaterThanOrEqual(2)
      expect(d.tags.length).toBeGreaterThanOrEqual(1)
    }
  })
})

/**
 * Simulates CSS Grid "dense" auto-placement: each door goes into the first free spot,
 * scanning row by row, where its whole shape fits. Returns the number of empty cells
 * inside the filled area and the row (1-based) each door starts on.
 */
function layout(
  order: number[],
  cols: number,
  fullWidth: Set<number> = new Set(),
): { empty: number; rowOf: Map<number, number> } {
  const shape = (id: number) => {
    if (fullWidth.has(id)) return [2, 1] // phones: a normal door stretched to fill its row
    const size = doors.find((d) => d.id === id)!.size
    if (size === 'big') return [2, 2]
    if (size === 'wide') return [2, 1]
    if (size === 'tall') return cols === 2 ? [2, 1] : [1, 2] // phones turn tall doors wide
    return [1, 1]
  }
  const grid: boolean[][] = []
  const rowOf = new Map<number, number>()
  const free = (r: number, c: number) => !(grid[r]?.[c] ?? false)
  for (const id of order) {
    const [w, h] = shape(id)
    placing: for (let r = 0; ; r++) {
      for (let c = 0; c + w <= cols; c++) {
        let fits = true
        for (let dr = 0; dr < h && fits; dr++) for (let dc = 0; dc < w && fits; dc++) fits = free(r + dr, c + dc)
        if (fits) {
          for (let dr = 0; dr < h; dr++) {
            grid[r + dr] ??= []
            for (let dc = 0; dc < w; dc++) grid[r + dr][c + dc] = true
          }
          rowOf.set(id, r + 1)
          break placing
        }
      }
    }
  }
  let empty = 0
  for (const row of grid) for (let c = 0; c < cols; c++) if (!row[c]) empty++
  return { empty, rowOf }
}

describe("today's door near the top", () => {
  it('keeps every door exactly once', () => {
    for (let today = 1; today <= 24; today++) {
      expect([...orderWithTodayFirst(gridOrder, today)].sort((a, b) => a - b)).toEqual(
        Array.from({ length: 24 }, (_, i) => i + 1),
      )
    }
  })

  it('leaves no gaps on any day, and puts today near the top at every width', () => {
    for (let today = 1; today <= 24; today++) {
      const order = orderWithTodayFirst(gridOrder, today)
      for (const cols of [2, 4, 6]) {
        const { empty, rowOf } = layout(order, cols)
        expect({ today, cols, empty }).toEqual({ today, cols, empty: 0 })
        // desktop: first two rows; tablet: first three; phones: first five (big doors take 2 rows)
        const maxRow = cols === 6 ? 2 : cols === 4 ? 3 : 5
        expect({ today, cols, inFirstRows: rowOf.get(today)! <= maxRow }).toEqual({ today, cols, inFirstRows: true })
      }
    }
  })
})

describe('phone order', () => {
  it("puts today's door first, then every other door in order 1–24", () => {
    expect(phoneOrder(1)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
    expect(phoneOrder(5)).toEqual([5, 1, 2, 3, 4, ...Array.from({ length: 19 }, (_, i) => i + 6)])
  })

  it('leaves no gaps on any day and keeps the doors in reading order', () => {
    for (let today = 1; today <= 24; today++) {
      const order = phoneOrder(today)
      const { empty, rowOf } = layout(order, 2, phoneFullWidth(order))
      expect({ today, empty }).toEqual({ today, empty: 0 })
      // every door starts on the same row as the one before it, or a later row: nothing jumps back
      const rows = order.map((id) => rowOf.get(id)!)
      expect({ today, rows }).toEqual({ today, rows: [...rows].sort((a, b) => a - b) })
    }
  })
})
