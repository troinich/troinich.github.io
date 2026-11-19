import { useEffect, useRef, useState } from 'react'
import type { Consent } from '../consent'
import { EatenCookie } from './EatenCookie'

interface Props {
  reducedMotion: boolean
  onAnswer: (value: Consent) => void
  /** Called when the prompt has fully finished (after the cookie is eaten). */
  onDone: () => void
}

export function CookiePrompt({ reducedMotion, onAnswer, onDone }: Props) {
  const [result, setResult] = useState<Consent | null>(null)
  const eating = result !== null
  const yesRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    yesRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!eating) return
    const delay = result === 'yes' ? (reducedMotion ? 1500 : 2400) : 2200
    const t = window.setTimeout(onDone, delay)
    return () => window.clearTimeout(t)
  }, [eating, result, onDone, reducedMotion])

  const answer = (value: Consent) => {
    onAnswer(value)
    setResult(value)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-desc"
        className={`w-full max-w-sm rounded-3xl border p-6 text-center shadow-2xl transition-colors duration-500 ${
          result === 'no' ? 'cookie-sad-bg border-transparent' : 'border-[var(--line)] bg-[var(--surface)]'
        }`}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && !eating) answer('no')
          if (e.key === 'Tab') {
            const buttons = e.currentTarget.querySelectorAll('button')
            if (buttons.length === 0) return e.preventDefault()
            const first = buttons[0]
            const last = buttons[buttons.length - 1]
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault()
              last.focus()
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault()
              first.focus()
            }
          }
        }}
      >
        {result === 'no' ? (
          <div role="status">
            <img
              src={`${import.meta.env.BASE_URL}cookie-broken.avif`}
              alt="A broken cookie"
              className={`mx-auto h-64 w-auto object-contain ${reducedMotion ? '' : 'cookie-sad'}`}
            />
            <p className="mt-3 font-display text-2xl font-bold text-[#1d2733]">No cookie? Heartbreaking.</p>
            <p className="mt-1 text-sm text-[#3d4852]">Nothing is counted. The doors are still yours.</p>
          </div>
        ) : result === 'yes' ? (
          <div role="status">
            <EatenCookie reducedMotion={reducedMotion} />
            <p className="mt-3 font-display text-2xl font-bold">Nom nom nom.</p>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">Thank you. That was delicious.</p>
          </div>
        ) : (
          <>
            <img
              src={`${import.meta.env.BASE_URL}cookie-question.jpg`}
              alt="Someone dusting sugar over trays of freshly baked Christmas cookies by candlelight"
              className="-mx-6 -mt-6 mb-1 block aspect-[3/2] w-[calc(100%+3rem)] max-w-none rounded-t-3xl object-cover"
            />
            <h2 id="cookie-title" className="mt-3 font-display text-3xl font-bold">
              Btw, cookie?
            </h2>
            <p id="cookie-desc" className="mt-2 text-sm text-[var(--ink-soft)]">
              Say yes and I'll anonymously count your visit with GoatCounter, so I know someone stopped by. No names, no
              ads, no tracking across sites. Say no and nothing happens. Promise.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => answer('no')}
                className="rounded-full border border-[var(--ink)] px-4 py-2.5 font-semibold hover:bg-[var(--bg)]"
              >
                No
              </button>
              <button
                ref={yesRef}
                type="button"
                onClick={() => answer('yes')}
                className="rounded-full bg-[var(--ink)] px-4 py-2.5 font-semibold text-[var(--bg)] hover:opacity-90"
              >
                Yes!
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
