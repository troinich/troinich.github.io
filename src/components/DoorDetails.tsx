import { useRef } from 'react'
import type { Door } from '../data/doors'
import { useModal } from '../hooks/useModal'
import { Snow } from './Snow'

const tagColor: Record<Door['category'], string> = {
  Skill: 'var(--tag-skill)',
  Achievement: 'var(--tag-achievement)',
  Fact: 'var(--tag-fact)',
}

interface Props {
  door: Door
  /** Shown on arrival for today's door: adds a "Today" label. */
  today?: boolean
  onClose: () => void
  onShowCv: () => void
}

export function DoorDetails({ door, today = false, onClose, onShowCv }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useModal(dialogRef, closeRef, onClose)

  return (
    <div
      className="details-backdrop fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Snow falls only while a door's card is open */}
      <Snow />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="door-details-title"
        className="door-details relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 sm:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--gold)] hover:text-[var(--ink)]"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 pr-10">
          <span className="text-4xl" aria-hidden="true">
            {door.emoji}
          </span>
          <div>
            <p className="text-xs font-semibold tracking-widest text-[var(--ink-soft)] uppercase">
              {today && <span className="mr-2 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[#2a0a0e]">Today</span>}
              Door {door.id} ·{' '}
              <span style={{ color: tagColor[door.category] }}>{door.category}</span>
            </p>
            <h2 id="door-details-title" className="font-display text-2xl font-bold text-[var(--gold)] sm:text-3xl">
              {door.headline}
            </h2>
          </div>
        </div>

        <p className="mt-4 leading-relaxed text-[var(--ink)]">{door.description}</p>

        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--open-ink-soft)]">
          {door.details.filter((d) => d !== door.description).map((d) => (
            <li key={d} className="flex gap-2">
              <span className="mt-0.5 text-[var(--gold)]" aria-hidden="true">
                ✦
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ul>

        {door.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tools and topics">
            {door.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-[var(--line)] px-2.5 py-1 text-xs font-medium text-[var(--ink-soft)]"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onShowCv}
            className="text-sm font-semibold text-[var(--gold)] underline underline-offset-4 hover:brightness-110"
          >
            See it in the full CV →
          </button>
        </div>
      </div>
    </div>
  )
}
