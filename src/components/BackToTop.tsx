import { useEffect, useState } from 'react'

/**
 * Round ↑ / ↓ buttons for phones, stacked in the bottom-right corner:
 * ↑ shows once the visitor has scrolled past the header, ↓ while they're not yet at the bottom.
 */
export function BackToTop({ reducedMotion }: { reducedMotion: boolean }) {
  const [canGoUp, setCanGoUp] = useState(false)
  const [canGoDown, setCanGoDown] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const bottom = document.documentElement.scrollHeight - window.innerHeight
      setCanGoUp(window.scrollY > 600)
      setCanGoDown(bottom - window.scrollY > 300)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const go = (top: number) => window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' })
  if (!canGoUp && !canGoDown) return null
  return (
    <div className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex flex-col gap-2 sm:hidden">
      {canGoUp && (
        <button type="button" onClick={() => go(0)} aria-label="Back to top" className="back-to-top icon-btn text-lg">
          <span aria-hidden="true">↑</span>
        </button>
      )}
      {canGoDown && (
        <button
          type="button"
          onClick={() => go(document.documentElement.scrollHeight)}
          aria-label="Go to bottom"
          className="back-to-top icon-btn text-lg"
        >
          <span aria-hidden="true">↓</span>
        </button>
      )}
    </div>
  )
}
