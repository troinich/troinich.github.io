import { useEffect, useRef, useState } from 'react'
import { cv } from '../data/cv'
import { PhotoZoom } from './PhotoZoom'
import { HireMeButtons } from './HireMeButtons'

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
    <header className="flex flex-col gap-6 pb-6 pt-10 sm:pt-14">
      {/* A solid printed panel behind the intro, as wide as the door grid, so it reads clearly over the pattern */}
      {/* Phones: name with a small photo to its right, details full width below.
          Desktop: text and contact buttons on the left, bigger photo on the right.
          (Layout in index.css: .intro-grid) */}
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
          <ul
            role="list"
            className="space-y-0.5 text-[15px] leading-snug text-[var(--ink)] sm:text-[17px] sm:leading-normal"
          >
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
        {/* "Hiring? Let's talk." with the contact buttons to its right (they wrap below on very narrow screens) */}
        <div className="intro-grid__contact flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="font-display text-lg font-bold text-[var(--gold)]">Hiring? Let's talk.</p>
          <HireMeButtons variant="intro" pdf place="intro" />
        </div>
      </div>
      {/* Calendar controls: quiet pills, so they don't compete with the gold contact buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {showOpenAll && (
          <button
            ref={openAllRef}
            type="button"
            onClick={() => {
              focusNext.current = 'close'
              onOpenAll()
            }}
            className="btn btn--quiet"
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
            className="btn btn--quiet"
          >
            Close all doors
          </button>
        )}
        {onGoToToday && (
          <button type="button" onClick={onGoToToday} className="btn btn--quiet sm:hidden">
            Go to today's door
          </button>
        )}
        <button type="button" onClick={onShowCv} className="btn btn--quiet">
          Show full CV
        </button>
        {/* the bell and the counter wrap together, so the counter never sits alone under the buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMuted}
            aria-pressed={!muted}
            aria-label="Jingle sound"
            title={muted ? 'Turn jingle on' : 'Turn jingle off'}
            className="icon-btn icon-btn--quiet text-[var(--gold)]"
          >
            {/* An SVG bell, not the 🔔 emoji: each device's emoji font draws the emoji off-centre in
                a different way, so it could never sit in the middle of the circle everywhere.
                Phosphor Icons, duotone (https://phosphoricons.com, MIT). */}
            <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false" className="h-5 w-5">
              <path
                d="M208,192H48a8,8,0,0,1-6.88-12C47.71,168.6,56,139.81,56,104a72,72,0,0,1,144,0c0,35.82,8.3,64.6,14.9,76A8,8,0,0,1,208,192Z"
                opacity="0.2"
              />
              {muted ? (
                <path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L58.82,63.8A79.59,79.59,0,0,0,48,104c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.8a40,40,0,0,0,78.4,0h15.44l19.44,21.38a8,8,0,1,0,11.84-10.76ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a63.65,63.65,0,0,1,6.26-27.62L168.09,184Zm166-4.73a8.13,8.13,0,0,1-2.93.55,8,8,0,0,1-7.44-5.08C196.35,156.19,192,129.75,192,104A64,64,0,0,0,96.43,48.31a8,8,0,0,1-7.9-13.91A80,80,0,0,1,208,104c0,35.35,8.05,58.59,10.52,64.88A8,8,0,0,1,214,179.25Z" />
              ) : (
                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
              )}
            </svg>
          </button>
          <p className="text-sm text-[var(--ink-soft)]">
            <span className="font-semibold text-[var(--ink)]">{openedCount}</span> / {total} opened
            {allOpen ? ' · Ho ho ho!' : ''}
          </p>
        </div>
      </div>
      {zoomed && <PhotoZoom onClose={() => setZoomed(false)} onShowCv={onShowCv} />}
    </header>
  )
}
