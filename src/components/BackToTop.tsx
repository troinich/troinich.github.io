import { useEffect, useState } from 'react'

/** Round "back to top" button for phones; shows up once the visitor has scrolled past the header. */
export function BackToTop({ reducedMotion }: { reducedMotion: boolean }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}
      aria-label="Back to top"
      className="back-to-top icon-btn fixed right-4 bottom-4 z-30 text-lg sm:hidden"
    >
      <span aria-hidden="true">↑</span>
    </button>
  )
}
