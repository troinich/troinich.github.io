import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { useModal } from '../hooks/useModal'
import { SeasonIcon, seasonOf } from './SeasonIcon'

type Phase = 'intro' | 'build' | 'done'

const steps = ['Roll some snow', 'Find buttons', 'Dress him up'] as const

/** The piece you place on the snowman at each step (shown in the tray, and dragged onto the picture). */
const pieces = ['❄️', '⚫', '🎩🥕'] as const

interface Props {
  /** The visitor would rather wait for December. */
  onWait: () => void
  /** The snowman is built: unlock the calendar. */
  onUnlock: () => void
  /** Called once when the last piece goes on, e.g. to play a sound. */
  onBuilt?: () => void
  /**
   * 'unlock' (default): the "Too early!" lockout that unlocks the calendar.
   * 'replay': just for fun, from the footer. Starts straight at building and changes nothing:
   * onUnlock and onWait both only close the game.
   */
  mode?: 'unlock' | 'replay'
}

/** "Too early!" message plus a build-a-snowman-in-3-clicks game that unlocks the calendar (or a replay). */
export function SnowmanGame({ onWait, onUnlock, onBuilt, mode = 'unlock' }: Props) {
  const replay = mode === 'replay'
  const [phase, setPhase] = useState<Phase>(replay ? 'build' : 'intro')
  const [season] = useState(() => seasonOf())
  const [built, setBuilt] = useState(0) // 0–3 clicks so far
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLButtonElement>(null)
  const buildRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef<HTMLButtonElement>(null)
  useModal(dialogRef, replay ? buildRef : firstRef, onWait)

  const build = () => {
    const next = built + 1
    setBuilt(next)
    if (next < steps.length) {
      // keep keyboard focus on the tray: move it to the next glowing piece
      window.setTimeout(() => buildRef.current?.focus(), 0)
    }
    if (next === steps.length) {
      onBuilt?.()
      // straight to the finished snowman and the win message
      setPhase('done')
      window.setTimeout(() => openRef.current?.focus(), 0)
    }
  }

  // Dragging the current piece onto the picture (mouse, pen or finger). A short press without
  // moving counts as a tap and is handled by the button's click instead.
  const dropRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<{ x: number; y: number; startX: number; startY: number; moved: boolean; over: boolean } | null>(null)
  const suppressClick = useRef(false)
  const overDrop = (x: number, y: number) => {
    const r = dropRef.current?.getBoundingClientRect()
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
  }
  const startDrag = (e: ReactPointerEvent<HTMLButtonElement>) => {
    suppressClick.current = false
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setDrag({ x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, moved: false, over: false })
  }
  const moveDrag = (e: ReactPointerEvent<HTMLButtonElement>) => {
    setDrag((d) => {
      if (!d) return d
      const moved = d.moved || Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 6
      return { ...d, x: e.clientX, y: e.clientY, moved, over: moved && overDrop(e.clientX, e.clientY) }
    })
  }
  const endDrag = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag
    setDrag(null)
    if (!d?.moved) return // a tap: the click handler builds
    suppressClick.current = true // this was a drag, so ignore the click that follows
    window.setTimeout(() => (suppressClick.current = false), 0)
    if (overDrop(e.clientX, e.clientY)) build()
  }

  // A small 👆 that shows the drag gesture on step 1: it slides from the glowing piece diagonally
  // up onto the picture twice, then goes away. Any touch, click or key press hides it straight away.
  const [hintDone, setHintDone] = useState(false)
  const showHint = phase === 'build' && built === 0 && !hintDone
  useEffect(() => {
    if (!showHint) return
    const hide = () => setHintDone(true)
    const timer = window.setTimeout(hide, 3400)
    window.addEventListener('pointerdown', hide)
    window.addEventListener('keydown', hide)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointerdown', hide)
      window.removeEventListener('keydown', hide)
    }
  }, [showHint])

  // One step back; from the first step, back to the "Too early!" message (or close, when replaying)
  const back = () => {
    if (built === 0 && replay) return onWait()
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
        className="door-details relative z-10 max-h-[94vh] w-full max-w-md overflow-y-auto rounded-3xl p-6 text-center sm:max-w-lg sm:p-8"
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
            {/* title row: small round Back on the left, title centred, an empty spacer on the right */}
            <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2">
              <button type="button" onClick={back} aria-label="Back" title="Back" className="icon-btn !h-10 !w-10 text-lg">
                <span aria-hidden="true">←</span>
              </button>
              <h2 id="lock-title" className="font-display text-xl font-bold text-[var(--gold)] sm:text-2xl">
                Build a snowman
              </h2>
              <span aria-hidden="true" />
            </div>
            <p className="mt-1 text-sm text-[var(--open-ink-soft)] sm:whitespace-nowrap" aria-live="polite">
              Step {built + 1} of {steps.length} · drag the glowing piece onto the picture, or tap it
            </p>
            <SnowmanSteps built={built} dropRef={dropRef} dropActive={drag?.over ?? false} />
            <ul className="mt-4 grid grid-cols-3 gap-2" aria-label="Snowman pieces">
              {steps.map((label, i) => {
                const state = i < built ? 'done' : i === built ? 'current' : 'later'
                return (
                  <li key={label} className="relative">
                    {state === 'current' && showHint && (
                      <span className="drag-hint" aria-hidden="true">
                        👆
                      </span>
                    )}
                    <button
                      ref={state === 'current' ? buildRef : undefined}
                      type="button"
                      disabled={state !== 'current'}
                      onClick={() => {
                        if (suppressClick.current) return
                        build()
                      }}
                      onPointerDown={state === 'current' ? startDrag : undefined}
                      onPointerMove={state === 'current' ? moveDrag : undefined}
                      onPointerUp={state === 'current' ? endDrag : undefined}
                      onPointerCancel={() => setDrag(null)}
                      className={`snow-piece snow-piece--${state}`}
                    >
                      <span className="snow-piece__icon" aria-hidden="true">
                        {state === 'done' ? '✓' : pieces[i]}
                      </span>
                      <span className="snow-piece__label">{label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            {/* The dragged piece is drawn on <body>, not inside the card: the card's zoom-in
                transform would otherwise offset it from the pointer. */}
            {drag?.moved &&
              createPortal(
                <span className="snow-piece__ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
                  {pieces[built]}
                </span>,
                document.body,
              )}
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
              {replay ? 'What a snowman!' : "You've built your way in!"}
            </h2>
            {!replay && (
              <p className="mt-2 text-sm text-[var(--open-ink-soft)]">The calendar is unlocked for you, whatever the date.</p>
            )}
            <button
              ref={openRef}
              type="button"
              onClick={onUnlock}
              className="btn btn--primary mt-5 w-full"
            >
              {replay ? 'Back to the calendar' : '🎁 Open the calendar'}
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

/**
 * Shows the picture for the current step, crossfading from one to the next.
 * It is the drop target for the dragged piece; tapping the picture itself does nothing.
 */
function SnowmanSteps({
  built,
  dropRef,
  dropActive,
}: {
  built: number
  dropRef: React.RefObject<HTMLDivElement>
  dropActive: boolean
}) {
  const current = STEP_IMAGES[Math.min(built, STEP_IMAGES.length - 1)]
  return (
    <div
      ref={dropRef}
      className={`snowman-steps relative mx-auto mt-4 aspect-square w-full max-w-[18rem] overflow-hidden rounded-2xl ${dropActive ? 'is-drop-target' : ''}`}
      role="img"
      aria-label={current.alt}
    >
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
