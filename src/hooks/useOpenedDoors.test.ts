import { act, renderHook } from '@testing-library/react'
import { STORAGE_KEY, useOpenedDoors } from './useOpenedDoors'

const order = [3, 1, 2]

describe('useOpenedDoors', () => {
  it('toggles a door open and closed', () => {
    const { result } = renderHook(() => useOpenedDoors(order, 0))
    act(() => result.current.toggle(2))
    expect(result.current.opened.has(2)).toBe(true)
    act(() => result.current.toggle(2))
    expect(result.current.opened.has(2)).toBe(false)
  })

  it('opens all instantly without stagger, then closes all', () => {
    const { result } = renderHook(() => useOpenedDoors(order, 0))
    act(() => result.current.openAll())
    expect(result.current.opened.size).toBe(3)
    act(() => result.current.closeAll())
    expect(result.current.opened.size).toBe(0)
  })

  it('cascades open all with a stagger', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useOpenedDoors(order, 60))
    act(() => result.current.openAll())
    expect(result.current.opening).toBe(true)
    act(() => vi.advanceTimersByTime(0))
    expect([...result.current.opened]).toEqual([3])
    act(() => vi.advanceTimersByTime(200))
    expect(result.current.opened.size).toBe(3)
    expect(result.current.opening).toBe(false)
    vi.useRealTimers()
  })

  it('closeAll stops a cascade that is still running', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useOpenedDoors(order, 60))
    act(() => result.current.openAll())
    act(() => vi.advanceTimersByTime(0))
    act(() => result.current.closeAll())
    expect(result.current.opening).toBe(false)
    act(() => vi.advanceTimersByTime(200))
    expect(result.current.opened.size).toBe(0)
    vi.useRealTimers()
  })

  it('persists to and restores from localStorage', () => {
    const first = renderHook(() => useOpenedDoors(order, 0))
    act(() => first.result.current.toggle(1))
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([1])
    first.unmount()

    const second = renderHook(() => useOpenedDoors(order, 0))
    expect(second.result.current.opened.has(1)).toBe(true)
  })

  it('ignores corrupt storage', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    const { result } = renderHook(() => useOpenedDoors(order, 0))
    expect(result.current.opened.size).toBe(0)
  })
})
