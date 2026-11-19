import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Consent } from '../consent'
import { Gingerbread } from './Gingerbread'

interface Props {
  reducedMotion: boolean
  onAnswer: (value: Consent) => void
  /** "Not now": hide for this visit without saving an answer. */
  onDismiss: () => void
  /** Called once the little "thank you" moment after answering is over. */
  onDone: () => void
}

/**
 * The cookie question as a small, non-blocking card: bottom-right on desktop, a slim bar on phones.
 * Visitors can keep using the page and answer whenever they like. After answering, a short reaction
 * plays and closes itself after 2 seconds; tapping it closes it straight away.
 */
export function CookieBanner({ reducedMotion, onAnswer, onDismiss, onDone }: Props) {
  const [result, setResult] = useState<Consent | null>(null)
  const [leaving, setLeaving] = useState<false | 'dust' | 'fade'>(false)
  const [dust, setDust] = useState<DustSpeck[] | null>(null)
  const cardRef = useRef<HTMLElement>(null)
  const leaveTimer = useRef<number>(undefined)
  const isLeaving = useRef(false) // a ref, so a timer set up earlier still sees the latest value
  // if this card is replaced (e.g. "Cookie settings" opens a fresh one), its pending close must not fire
  useEffect(() => () => window.clearTimeout(leaveTimer.current), [])

  // Closing, only ever once: tapping the card makes it dissolve into dust; closing by itself
  // (or "Not now") just fades and slides it away.
  const leave = (then: () => void, how: 'dust' | 'fade' = 'fade') => {
    if (isLeaving.current) return
    isLeaving.current = true
    setLeaving(how)
    if (how === 'dust' && !reducedMotion) {
      const rect = cardRef.current?.getBoundingClientRect()
      if (rect && rect.width) setDust(makeDust(rect))
    }
    leaveTimer.current = window.setTimeout(then, reducedMotion ? 0 : how === 'dust' ? DISSOLVE_MS : FADE_MS)
  }

  useEffect(() => {
    if (!result) return
    // the bath ("No thanks") always gets 2 seconds; the eating gets 2, or 1.2 without animation
    const t = window.setTimeout(() => leave(onDone), result === 'no' || !reducedMotion ? 2000 : 1200)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  const answer = (value: Consent) => {
    onAnswer(value)
    setResult(value)
  }

  return (
    <>
      <section
        ref={cardRef}
        className={`cookie-banner ${reducedMotion ? '' : 'cookie-banner--animate'} ${leaving === 'dust' ? 'cookie-banner--dissolving' : leaving === 'fade' ? 'cookie-banner--fading' : ''}`}
        aria-labelledby="cookie-title"
        aria-live="polite"
      >
        {result === 'yes' ? (
          <div
            className="flex cursor-pointer items-center gap-3"
            role="status"
            onClick={() => leave(onDone, 'dust')}
            title="Tap to close"
          >
            <Gingerbread state="eaten" reducedMotion={reducedMotion} className="h-14 w-14 shrink-0" />
            <p className="text-sm text-[var(--ink-2)]">
              <strong className="font-display text-base text-[var(--gold)]">Nom nom nom.</strong> Thank you, that was
              delicious.
            </p>
          </div>
        ) : result === 'no' ? (
          <div
            className="flex cursor-pointer items-center justify-between gap-3"
            role="status"
            onClick={() => leave(onDone, 'dust')}
            title="Tap to close"
          >
            <p className="font-display text-2xl font-bold text-[var(--gold)]">Phew!</p>
            <img
              src={`${import.meta.env.BASE_URL}marshmallow-bath.jpg`}
              alt="The gingerbread man relaxing in a bathtub full of marshmallows"
              className={`h-24 w-24 shrink-0 rounded-xl object-cover ${reducedMotion ? '' : 'cookie-bath'}`}
            />
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 pr-8">
              <Gingerbread decorative className="h-11 w-11 shrink-0" />
              <div>
                <h2 id="cookie-title" className="font-display text-lg font-bold text-[var(--gold)]">
                  Btw, cookie?
                </h2>
                <p className="mt-1 text-sm leading-snug text-[var(--ink-2)]">
                  Say yes and I'll anonymously count your visit with GoatCounter. No names, no ads, no tracking across
                  sites.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => leave(onDismiss)}
              aria-label="Not now"
              title="Not now"
              className="cookie-banner__close"
            >
              ✕
            </button>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => answer('no')} className="btn btn--secondary btn--sm">
                No thanks
              </button>
              <button type="button" onClick={() => answer('yes')} className="btn btn--secondary btn--sm">
                Sure!
              </button>
            </div>
          </>
        )}
      </section>
      {/* the dust is drawn on <body>, outside the card, so the card's dissolve mask doesn't hide it */}
      {dust &&
        createPortal(
          <div className="dust" aria-hidden="true">
            {dust.map((d, i) => (
              <span
                key={i}
                style={{
                  left: d.x,
                  top: d.y,
                  width: d.size,
                  height: d.size,
                  background: d.color,
                  animationDelay: `${d.delay}ms`,
                  ['--dx' as string]: `${d.dx}px`,
                  ['--dy' as string]: `${d.dy}px`,
                }}
              />
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}

/** How long the dissolve takes (the left-to-right sweep plus the last specks drifting off). */
const DISSOLVE_MS = 900
/** How long the plain fade-out takes. */
const FADE_MS = 300

type DustSpeck = { x: number; y: number; size: number; color: string; delay: number; dx: number; dy: number }

/** Tiny specks scattered over the card; each breaks off as the dissolve sweep passes it. */
function makeDust(rect: DOMRect): DustSpeck[] {
  const colors = ['#e8c06a', '#f8efdc', '#c98a4b', '#e8c06a', '#b5713a', '#fff3d0']
  return Array.from({ length: 90 }, () => {
    const fx = Math.random()
    return {
      x: rect.left + fx * rect.width,
      y: rect.top + Math.random() * rect.height,
      size: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: fx * 450, // follows the sweep from left to right
      dx: 20 + Math.random() * 70,
      dy: -(15 + Math.random() * 70),
    }
  })
}
