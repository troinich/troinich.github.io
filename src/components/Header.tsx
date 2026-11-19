import { cv } from '../data/cv'

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
  return (
    <header className="flex flex-col gap-6 pb-8 pt-10 sm:pt-14">
      {/* A soft, frosted panel behind the intro so it reads clearly over the patterned background */}
      <div className="intro-panel -mx-4 rounded-3xl px-4 py-5 sm:mx-0 sm:w-fit sm:max-w-3xl sm:px-7 sm:py-6">
        <p className="text-sm font-medium tracking-widest text-[var(--gold)] uppercase">🎄 Meet me · Advent edition</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-[var(--ink)] [text-shadow:0_0_30px_rgba(232,192,106,0.35)] sm:text-6xl">{cv.name}</h1>
        <p className="mt-2 text-lg text-[var(--ink)]">Fullstack Web Engineer · Ex-tax lawyer · Professional door opener</p>
        <p className="mt-3 max-w-2xl text-[#e3dccb]">
          A PDF can't surprise you. Twenty-four doors can. Open them one by one, or skip the suspense.
        </p>
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
    </header>
  )
}
