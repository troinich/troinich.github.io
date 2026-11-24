import { useRef } from 'react'
import { useModal } from '../hooks/useModal'
import { HireMeButtons } from './HireMeButtons'

/** First sentence of the CV profile, shown under the zoomed photo. */
const INTRO =
  'Fullstack web engineer with 7+ years building production web applications in TypeScript, React and JavaScript, with hands-on backend development in C# (.NET) and Node.js, on a B2B SaaS platform used in 10+ markets.'

/**
 * Full-screen view of the header photo with a short intro and contact buttons.
 * Closes on a click outside the buttons, ✕ or Escape.
 */
export function PhotoZoom({ onClose, onShowCv }: { onClose: () => void; onShowCv: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useModal(dialogRef, closeRef, onClose)

  return (
    <div
      className="details-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Photo of Natalia Troinich"
        className="photo-zoom relative flex max-h-[92vh] w-fit max-w-[min(90vw,34rem)] flex-col overflow-y-auto rounded-[var(--radius-card)] border-2 border-[var(--gold)] bg-[var(--surface)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
      >
        <img
          src={`${import.meta.env.BASE_URL}me-large.webp`}
          alt="Natalia Troinich standing between tall autumn hedges by a long pond"
          className="block max-h-[62vh] w-full object-cover"
        />
        <div className="px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-sm leading-relaxed text-[var(--ink)] sm:text-base">
            <strong className="font-display text-lg font-bold text-[var(--gold)] sm:text-xl">Hej, it's me!</strong>{' '}
            {INTRO}
          </p>
          <div className="mt-4">
            <HireMeButtons
              size="sm"
              place="photo"
              onShowCv={() => {
                onClose()
                onShowCv()
              }}
            />
          </div>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo"
          className="absolute top-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
