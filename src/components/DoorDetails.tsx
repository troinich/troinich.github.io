import { useRef } from 'react'
import type { Door } from '../data/doors'
import { useModal } from '../hooks/useModal'
import { Snow } from './Snow'
import { HireMeButtons } from './HireMeButtons'

const tagColor: Record<NonNullable<Door['category']>, string> = {
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
      className="details-backdrop modal-backdrop z-40"
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
          className="icon-btn absolute top-4 right-4"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 pr-12">
          <span className="text-4xl" aria-hidden="true">
            {door.emoji}
          </span>
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">
              {today && <span className="mr-2 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[#2a0a0e]">Today</span>}
              Door {door.id}
              {door.category && (
                <>
                  {' · '}
                  <span style={{ color: tagColor[door.category] }}>{door.category}</span>
                </>
              )}
            </p>
            <h2 id="door-details-title" className="font-display text-2xl font-bold text-[var(--gold)] sm:text-3xl">
              {door.headline}
            </h2>
          </div>
        </div>

        {door.photo && (
          <img
            src={`${import.meta.env.BASE_URL}${door.photo}`}
            alt="Natalia Troinich"
            className="mx-auto mt-5 h-36 w-36 rounded-full border-2 border-[var(--gold)] object-cover shadow-[0_0_30px_-6px_rgba(232,192,106,0.6)]"
          />
        )}
        <p className="mt-4 leading-relaxed text-[var(--ink-2)]">{door.description}</p>
        {door.highlight && <p className="door__highlight mt-5 mb-1">{door.highlight}</p>}
        {door.hireMe && (
          <div className="mt-4">
            <HireMeButtons onShowCv={onShowCv} />
          </div>
        )}

        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--open-ink-soft)]">
          {door.details
            .filter((d) => d !== door.description)
            .map((d) => (
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
