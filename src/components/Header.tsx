import { useEffect, useRef, useState } from 'react'
import { cv } from '../data/cv'
import { PhotoZoom } from './PhotoZoom'

interface Props {
  openedCount: number
  /** "Open all doors" is still cascading: the buttons treat the calendar as fully open already. */
  opening?: boolean
  total: number
  muted: boolean
  onToggleMuted: () => void
  onOpenAll: () => void
  onCloseAll: () => void
  onShowCv: () => void
  /** Phones only: a shortcut that scrolls to today's door without opening it (left out while locked). */
  onGoToToday?: () => void
}

export function Header({
  openedCount,
  opening = false,
  total,
  muted,
  onToggleMuted,
  onOpenAll,
  onCloseAll,
  onShowCv,
  onGoToToday,
}: Props) {
  const allOpen = openedCount === total
  // While the doors cascade open, "Open all doors" flips to "Close all doors" at once, instead of
  // both showing until the count reaches the total.
  const showOpenAll = !allOpen && !opening
  const showCloseAll = openedCount > 0 || opening
  const [zoomed, setZoomed] = useState(false)
  // The clicked button disappears, so focus moves to the one that replaces it (keyboard users keep their place).
  const openAllRef = useRef<HTMLButtonElement>(null)
  const closeAllRef = useRef<HTMLButtonElement>(null)
  const focusNext = useRef<'open' | 'close' | null>(null)
  useEffect(() => {
    if (!focusNext.current) return
    const target = focusNext.current === 'close' ? closeAllRef.current : openAllRef.current
    focusNext.current = null
    if (target && document.activeElement === document.body) target.focus()
  })
  return (
    <header className="flex flex-col gap-6 pb-8 pt-10 sm:pt-14">
      {/* A solid printed panel behind the intro, as wide as the door grid, so it reads clearly over the pattern */}
      {/* Phones: name with a small photo to its right, details full width below.
          Desktop: text on the left, bigger photo on the right. (Layout in index.css: .intro-grid) */}
      <div className="intro-panel intro-grid rounded-[var(--radius-card)] px-5 py-5 sm:px-7 sm:py-6">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label="Say hej: photo and intro"
          className="intro-grid__photo group shrink-0 rounded-full"
        >
          <img
            src={`${import.meta.env.BASE_URL}me.webp`}
            alt=""
            width={192}
            height={192}
            className="h-24 w-24 rounded-full border-2 border-[var(--gold)] object-cover transition duration-300 group-hover:scale-105 sm:h-48 sm:w-48"
          />
        </button>
        <div className="intro-grid__title">
          <p className="eyebrow whitespace-nowrap max-sm:tracking-[0.12em] max-[379px]:text-[0.6875rem] max-[379px]:tracking-[0.08em] max-[339px]:text-[0.625rem] max-[339px]:tracking-[0.05em]">
            Meet me · Advent edition
          </p>
          <h1 className="mt-1 font-display text-[2rem] leading-[1.05] font-bold text-[var(--ink)] sm:mt-2 sm:text-6xl sm:leading-tight">
            {cv.name}
          </h1>
        </div>
        <div className="intro-grid__body">
          <ul role="list" className="space-y-0.5 text-[15px] leading-snug text-[var(--ink)] sm:text-[17px] sm:leading-normal">
            {[
              'Fullstack Web Engineer with 7+ years of experience',
              'TypeScript · React · C# / .NET · Node.js',
              'Former tax lawyer',
              'Based in Gothenburg, Sweden',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full bg-[#c8323c]" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 max-w-2xl text-[var(--ink-2)]">
            I turned my CV into an advent calendar. Open one door a day, or open them all at once.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {showOpenAll && (
          <button
            ref={openAllRef}
            type="button"
            onClick={() => {
              focusNext.current = 'close'
              onOpenAll()
            }}
            className="btn btn--primary"
          >
            Open all doors
          </button>
        )}
        {showCloseAll && (
          <button
            ref={closeAllRef}
            type="button"
            onClick={() => {
              focusNext.current = 'open'
              onCloseAll()
            }}
            className="btn btn--secondary"
          >
            Close all doors
          </button>
        )}
        {onGoToToday && (
          <button type="button" onClick={onGoToToday} className="btn btn--secondary sm:hidden">
            Go to today's door
          </button>
        )}
        <button type="button" onClick={onShowCv} className="btn btn--secondary">
          Show full CV
        </button>
        <button
          type="button"
          onClick={onToggleMuted}
          aria-pressed={!muted}
          aria-label="Jingle sound"
          title={muted ? 'Turn jingle on' : 'Turn jingle off'}
          className="icon-btn text-lg"
        >
          <span aria-hidden="true">{muted ? '🔕' : '🔔'}</span>
        </button>
        <p className="text-sm text-[var(--ink-soft)]">
          <span className="font-semibold text-[var(--ink)]">{openedCount}</span> / {total} opened
          {allOpen ? ' · Ho ho ho!' : ''}
        </p>
      </div>
      {zoomed && <PhotoZoom onClose={() => setZoomed(false)} onShowCv={onShowCv} />}
    </header>
  )
}
