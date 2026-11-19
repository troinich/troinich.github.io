import { useRef, useState } from 'react'
import { useModal } from '../hooks/useModal'
import { SeasonIcon, seasonOf } from './SeasonIcon'

type Phase = 'intro' | 'build' | 'done'

const steps = ['Roll some snow', 'Find buttons', 'Dress him up'] as const

interface Props {
  /** The visitor would rather wait for December. */
  onWait: () => void
  /** The snowman is built: unlock the calendar. */
  onUnlock: () => void
  /** Called once when the last piece goes on, e.g. to play a sound. */
  onBuilt?: () => void
}

/** "Too early!" message plus a build-a-snowman-in-3-clicks game that unlocks the calendar. */
export function SnowmanGame({ onWait, onUnlock, onBuilt }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [season] = useState(() => seasonOf())
  const [built, setBuilt] = useState(0) // 0–3 clicks so far
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLButtonElement>(null)
  const buildRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef<HTMLButtonElement>(null)
  useModal(dialogRef, firstRef, onWait)

  const build = () => {
    const next = built + 1
    setBuilt(next)
    if (next === steps.length) {
      onBuilt?.()
      // straight to the finished snowman and the win message
      setPhase('done')
      window.setTimeout(() => openRef.current?.focus(), 0)
    }
  }

  // One step back; from the first step, back to the "Too early!" message
  const back = () => {
    if (built > 0) setBuilt(built - 1)
    else setPhase('intro')
    window.setTimeout(() => (built > 0 ? buildRef : firstRef).current?.focus(), 0)
  }

  return (
    <div className="details-backdrop modal-backdrop z-50">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lock-title"
        className="door-details relative z-10 max-h-[94vh] w-full max-w-md overflow-y-auto rounded-3xl p-6 text-center sm:p-8"
      >
        {phase === 'intro' && (
          <>
            <p className="eyebrow mb-4">
              Welcome to my Advent CV Calendar 🎄
            </p>
            <SeasonIcon season={season} className="mx-auto" />
            <h2 id="lock-title" className="mt-3 font-display text-3xl font-bold text-[var(--gold)]">
              Too early!
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--ink-2)]">
              The Advent calendar opens on <strong>1&nbsp;December</strong>.
            </p>
            <p className="mt-2 text-sm text-[var(--open-ink-soft)]">Build a snowman in 3 clicks to unlock early.</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:grid sm:grid-cols-2">
              <button
                type="button"
                onClick={onWait}
                className="btn btn--secondary"
              >
                No, I'll wait
              </button>
              <button
                ref={firstRef}
                type="button"
                onClick={() => {
                  setPhase('build')
                  window.setTimeout(() => buildRef.current?.focus(), 0)
                }}
                className="btn btn--primary"
              >
                Yes, let's do it! ⛄
              </button>
            </div>
          </>
        )}

        {phase === 'build' && (
          <>
            <h2 id="lock-title" className="font-display text-2xl font-bold text-[var(--gold)]">
              Build a snowman
            </h2>
            <p className="mt-1 text-sm text-[var(--open-ink-soft)]" aria-live="polite">
              Click {built + 1} of {steps.length}
            </p>
            <SnowmanSteps built={built} />
            <div className="mt-2 flex justify-center gap-2" aria-hidden="true">
              {steps.map((s, i) => (
                <span key={s} className={`h-2 w-8 rounded-full ${i < built ? 'bg-[var(--gold)]' : 'bg-[var(--line)]'}`} />
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={back}
                className="btn btn--secondary"
              >
                ← Back
              </button>
              <button
                ref={buildRef}
                type="button"
                onClick={build}
                className="btn btn--primary flex-1"
              >
                {steps[built]}
              </button>
            </div>
          </>
        )}

        {phase === 'done' && (
          <>
            <img
              src={`${import.meta.env.BASE_URL}snowman.jpg`}
              alt="The finished snowman: top hat, red striped scarf and carrot nose, in a winter forest framed by holly"
              className="mx-auto w-full max-w-[18rem] rounded-2xl"
            />
            <h2 id="lock-title" className="mt-4 font-display text-2xl font-bold text-[var(--gold)]">
              You've built your way in!
            </h2>
            <p className="mt-2 text-sm text-[var(--open-ink-soft)]">The calendar is unlocked for you, whatever the date.</p>
            <button
              ref={openRef}
              type="button"
              onClick={onUnlock}
              className="btn btn--primary mt-5 w-full"
            >
              🎁 Open the calendar
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/** The pictures of the snowman being built: empty forest, plain snowman, with buttons, finished. */
const STEP_IMAGES = [
  { src: 'snowman-steps/forest.jpg', alt: 'A snowy winter forest framed by holly, waiting for a snowman' },
  { src: 'snowman-steps/hatless.jpg', alt: 'A smiling snowman with twig arms, still without his hat and scarf' },
  { src: 'snowman-steps/buttons.jpg', alt: 'The snowman now has three coal buttons, still without his nose, hat and scarf' },
  { src: 'snowman.jpg', alt: 'The finished snowman with top hat, carrot nose and red scarf' },
]

/** Shows the picture for the current step, crossfading from one to the next. */
function SnowmanSteps({ built }: { built: number }) {
  const current = STEP_IMAGES[Math.min(built, STEP_IMAGES.length - 1)]
  return (
    <div className="snowman-steps relative mx-auto mt-4 aspect-square w-full max-w-[18rem] overflow-hidden rounded-2xl" role="img" aria-label={current.alt}>
      {STEP_IMAGES.map((img, i) => (
        <img
          key={img.src}
          src={`${import.meta.env.BASE_URL}${img.src}`}
          alt=""
          draggable={false}
          className={`snowman-steps__img ${i === Math.min(built, STEP_IMAGES.length - 1) ? 'is-current' : ''}`}
        />
      ))}
    </div>
  )
}
