import { useCallback, useEffect, useRef, useState } from 'react'

export const STORAGE_KEY = 'amazing-me:opened-doors'

function load(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? new Set(parsed.filter((n): n is number => typeof n === 'number')) : new Set()
  } catch {
    return new Set()
  }
}

function save(opened: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...opened]))
  } catch {
    // Storage unavailable (private mode, blocked): the page still works, it just forgets.
  }
}

/**
 * Tracks which doors are open and remembers them on this device.
 * `openAll` cascades through `order` with `staggerMs` between doors; `opening` is true until the
 * last door of the cascade is open (or `closeAll` stops it), so the UI can treat the calendar as
 * fully open straight away instead of waiting for the count to reach the total.
 */
export function useOpenedDoors(order: number[], staggerMs = 60) {
  const [opened, setOpened] = useState<Set<number>>(load)
  const [opening, setOpening] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => save(opened), [opened])

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  const toggle = useCallback((id: number) => {
    setOpened((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const open = useCallback((id: number) => {
    setOpened((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
  }, [])

  const openAll = useCallback(() => {
    clearTimers()
    if (staggerMs <= 0) {
      setOpened(new Set(order))
      return
    }
    setOpening(true)
    order.forEach((id, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setOpened((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
          if (i === order.length - 1) setOpening(false)
        }, i * staggerMs),
      )
    })
  }, [order, staggerMs])

  const closeAll = useCallback(() => {
    clearTimers()
    setOpening(false)
    setOpened(new Set())
  }, [])

  return { opened, opening, toggle, open, openAll, closeAll }
}
