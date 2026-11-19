import { useState } from 'react'
import { cv } from '../data/cv'
import { PhotoZoom } from './PhotoZoom'

interface Props {
  openedCount: number
  total: number
  muted: boolean
  onToggleMuted: () => void
  onOpenAll: () => void
  onCloseAll: () => void
  onShowCv: () => void
}

export function Header({ openedCount, total, muted, onToggleMuted, onOpenAll, onCloseAll, onShowCv }: Props) {
  const allOpen = openedCount === total
  const [zoomed, setZoomed] = useState(false)
  return (
    <header className="flex flex-col gap-6 pb-8 pt-10 sm:pt-14">
      {/* A soft, frosted panel behind the intro so it reads clearly over the patterned background */}
      {/* Phones: name with a small photo to its right, details full width below.
          Desktop: text on the left, bigger photo on the right. (Layout in index.css: .intro-grid) */}
      <div className="intro-panel intro-grid rounded-3xl px-5 py-5 sm:w-fit sm:max-w-4xl sm:px-7 sm:py-6">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label="Zoom in on photo"
          className="intro-grid__photo group shrink-0 cursor-zoom-in rounded-full"
        >
          <img
            src={`${import.meta.env.BASE_URL}me.jpg`}
            alt=""
            width={160}
            height={160}
            className="h-20 w-20 rounded-full border-2 border-[var(--gold)] object-cover shadow-[0_0_30px_-6px_rgba(232,192,106,0.6)] transition duration-300 group-hover:scale-105 sm:h-40 sm:w-40"
          />
        </button>
        <div className="intro-grid__title">
          <p className="eyebrow whitespace-nowrap max-sm:tracking-[0.12em] max-[379px]:text-[0.6875rem] max-[379px]:tracking-[0.08em] max-[339px]:text-[0.625rem] max-[339px]:tracking-[0.05em]">
            <span className="hidden sm:inline" aria-hidden="true">
              ✨{' '}
            </span>
            Meet me · Advent edition
          </p>
          <h1 className="mt-1 font-display text-[2rem] leading-[1.05] font-bold text-[var(--ink)] [text-shadow:0_0_30px_rgba(232,192,106,0.35)] sm:mt-2 sm:text-6xl sm:leading-tight">
            {cv.name}
          </h1>
        </div>
        <div className="intro-grid__body">
          <ul className="space-y-0.5 text-[15px] leading-snug text-[var(--ink)] sm:text-lg sm:leading-normal">
            {[
              'Fullstack Web Engineer with 7+ years of experience',
              'TypeScript · React · C# / .NET · Node.js',
              'Ex-tax lawyer',
              'Professional door opener',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span
                  className="mt-[0.3em] w-[16px] shrink-0 text-center text-[12px] leading-none sm:w-[18px] sm:text-[15px]"
                  aria-hidden="true"
                >
                  🎄
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 max-w-2xl text-[var(--ink-2)]">
            A PDF can't surprise you. Twenty-four doors can. Open them one by one, or skip the suspense.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {!allOpen && (
          <button type="button" onClick={onOpenAll} className="btn btn--primary">
            🎁 Open all doors
          </button>
        )}
        {openedCount > 0 && (
          <button type="button" onClick={onCloseAll} className="btn btn--secondary">
            Close all doors
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
          {allOpen ? ' 🎅 Ho ho ho!' : ''}
        </p>
      </div>
      {zoomed && <PhotoZoom onClose={() => setZoomed(false)} onShowCv={onShowCv} />}
    </header>
  )
}
