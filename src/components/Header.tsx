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
      <div className="intro-panel -mx-4 flex flex-col items-start gap-4 rounded-3xl px-4 py-5 sm:mx-0 sm:w-fit sm:max-w-4xl sm:flex-row sm:items-center sm:gap-7 sm:px-7 sm:py-6">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label="Zoom in on photo"
          className="group shrink-0 cursor-zoom-in rounded-full sm:order-last"
        >
          <img
            src={`${import.meta.env.BASE_URL}me.jpg`}
            alt=""
            width={160}
            height={160}
            className="h-24 w-24 rounded-full border-2 border-[var(--gold)] object-cover shadow-[0_0_30px_-6px_rgba(232,192,106,0.6)] transition duration-300 group-hover:scale-105 sm:h-40 sm:w-40"
          />
        </button>
        <div>
          <p className="text-sm font-medium tracking-widest text-[var(--gold)] uppercase">✨ Meet me · Advent edition</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-[var(--ink)] [text-shadow:0_0_30px_rgba(232,192,106,0.35)] sm:text-6xl">{cv.name}</h1>
          <ul className="mt-2 space-y-0.5 text-[15px] leading-snug text-[var(--ink)] sm:text-lg sm:leading-normal">
            {[
              'Fullstack Web Engineer with 7+ years of experience',
              'TypeScript · React · C# / .NET · Node.js',
              'Ex-tax lawyer',
              'Professional door opener',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span className="mt-[0.3em] w-[16px] shrink-0 text-center text-[12px] leading-none sm:w-[18px] sm:text-[15px]" aria-hidden="true">
                  🎄
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 max-w-2xl text-[#e3dccb]">
            A PDF can't surprise you. Twenty-four doors can. Open them one by one, or skip the suspense.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {!allOpen && (
          <button
            type="button"
            onClick={onOpenAll}
            className="rounded-full bg-[var(--gold)] px-5 py-2.5 font-semibold text-[#2a1a08] shadow-[0_0_20px_-4px_rgba(232,192,106,0.7)] transition hover:brightness-110"
          >
            🎁 Open all doors
          </button>
        )}
        {openedCount > 0 && (
          <button
            type="button"
            onClick={onCloseAll}
            className="rounded-full border border-[var(--line)] px-5 py-2.5 font-semibold text-[var(--ink)] transition hover:border-[var(--gold)]"
          >
            Close all doors
          </button>
        )}
        <button
          type="button"
          onClick={onShowCv}
          className="rounded-full border border-[var(--gold)] px-5 py-2.5 font-semibold text-[var(--ink)] transition hover:bg-[var(--surface)]"
        >
          Show full CV
        </button>
        <button
          type="button"
          onClick={onToggleMuted}
          aria-pressed={!muted}
          aria-label="Jingle sound"
          title={muted ? 'Turn jingle on' : 'Turn jingle off'}
          className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-lg transition hover:border-[var(--gold)]"
        >
          <span aria-hidden="true">{muted ? '🔕' : '🔔'}</span>
        </button>
        <p className="text-sm text-[var(--ink-soft)]">
          <span className="font-semibold text-[var(--ink)]">{openedCount}</span> / {total} opened
          {allOpen ? ' 🎅 Ho ho ho!' : ''}
        </p>
      </div>
      {zoomed && <PhotoZoom onClose={() => setZoomed(false)} />}
    </header>
  )
}
