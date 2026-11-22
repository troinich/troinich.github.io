import { useRef } from 'react'
import type { Door } from '../data/doors'
import { useModal } from '../hooks/useModal'
import { Snow } from './Snow'
import { HireMeButtons } from './HireMeButtons'

interface Props {
  door: Door
  onClose: () => void
  onShowCv: () => void
}

export function DoorDetails({ door, onClose, onShowCv }: Props) {
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
        className="door-details relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-card)] p-6 sm:p-8"
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

        <div className="pr-12">
          <div>
            <h2 id="door-details-title" className="font-display text-2xl font-bold text-[var(--gold)] sm:text-3xl">
              {door.headline}
            </h2>
          </div>
        </div>

        {door.photo && (
          <img
            src={`${import.meta.env.BASE_URL}${door.photo}`}
            alt="Natalia Troinich"
            className="mx-auto mt-5 h-36 w-36 rounded-full border-2 border-[var(--gold)] object-cover"
          />
        )}
        <p className="mt-4 leading-relaxed text-[var(--ink-2)]">{door.description}</p>
        {door.highlight && <p className="door__highlight mt-5 mb-1">{door.highlight}</p>}
        {door.hireMe && (
          <div className="mt-4">
            <HireMeButtons onShowCv={onShowCv} />
          </div>
        )}

        {/* role="list": Safari/VoiceOver drops list semantics when bullets are styled away */}
        <ul role="list" className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--open-ink-soft)]">
          {door.details
            .filter((d) => d !== door.description)
            .map((d) => (
              <li key={d} className="flex gap-2.5">
                <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" aria-hidden="true" />
                <span>{d}</span>
              </li>
            ))}
        </ul>

        {door.tools && door.tools.length > 0 && (
          <p className="mt-5 text-sm text-[var(--ink-soft)]">
            <span className="font-semibold text-[var(--ink-2)]">Tools:</span> {door.tools.join(', ')}
          </p>
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
