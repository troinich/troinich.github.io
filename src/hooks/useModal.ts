import { useEffect, type RefObject } from 'react'

/**
 * Modal behaviour for a dialog: focuses `initialFocus`, keeps Tab inside
 * `container`, closes on Escape, locks page scroll, and restores focus on close.
 */
export function useModal(
  container: RefObject<HTMLElement | null>,
  initialFocus: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    initialFocus.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      // Another dialog is open on top of this one: leave its keys alone.
      const topDialog = (e.target as Element | null)?.closest?.('[aria-modal="true"]')
      if (topDialog && topDialog !== container.current) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !container.current) return
      const focusables = container.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus()
    }
  }, [container, initialFocus, onClose])
}
