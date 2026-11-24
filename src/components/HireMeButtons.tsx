import { useEffect, useRef, useState } from 'react'
import { cv } from '../data/cv'
import { copyText, emailText, openEmail } from '../data/contact'
import { BOOKING_LABEL, BOOKING_URL } from '../config'
import { trackCta } from '../consent'

interface Props {
  size?: 'sm' | 'md'
  /**
   * 'row' (default): text buttons in one row. 'intro' (next to "Hiring? Let's talk."): only
   * "Book a call", "Email me" and (with `pdf`) "Download CV", as small buttons.
   */
  variant?: 'row' | 'intro'
  /** Adds a "Full CV" button. */
  onShowCv?: () => void
  /** Only the main button ("Book a call", or "Email me" when there is no booking page). */
  mainOnly?: boolean
  /** Booking page; defaults to `BOOKING_URL` in config.ts. */
  bookingUrl?: string
  /** Adds the PDF download: "Download CV" in the intro, "CV" + a download icon in the row. Screen readers hear "Download CV (PDF)". */
  pdf?: boolean
  /** Shows "LinkedIn" (default). Door 24 leaves it out. */
  linkedin?: boolean
  /** Where the buttons are, for click counting (e.g. 'intro', 'door24'). */
  place?: string
}

/**
 * The contact buttons: "Book a call" (when a booking page is set), "Email me", "LinkedIn" and
 * optionally "Full CV" and the CV download. Used in the intro, the CV view, the photo pop-up
 * and door 24. Only the first one is gold.
 */
export function HireMeButtons({
  size = 'md',
  variant = 'row',
  onShowCv,
  mainOnly = false,
  bookingUrl = BOOKING_URL,
  pdf = false,
  linkedin = true,
  place,
}: Props) {
  const sz = size === 'sm' ? 'btn--sm' : ''
  const secondary = `btn btn--secondary ${sz}`
  // 'copied' shows "✓ Email copied" for 3 seconds; 'failed' shows the address to copy by hand
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const reset = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(reset.current), [])
  const track = (what: string) => trackCta(what, place)

  // No email app opened: copy the address instead and say so
  const onNoEmailApp = async () => {
    const ok = await copyText(emailText())
    setStatus(ok ? 'copied' : 'failed')
    window.clearTimeout(reset.current)
    if (ok) reset.current = window.setTimeout(() => setStatus('idle'), 3000)
  }
  const onEmail = () => {
    track('email')
    openEmail(onNoEmailApp)
  }

  const feedback = (
    <>
      {status === 'failed' && (
        <p className="w-full text-sm text-[var(--ink)]">
          Copy my email: <span className="font-semibold select-all">{emailText()}</span>
        </p>
      )}
      <span className="sr-only" aria-live="polite">
        {status === 'copied' ? 'Email address copied to the clipboard' : ''}
      </span>
    </>
  )

  if (variant === 'intro') {
    // small gold-outline buttons, all alike (a filled one looked like it was hovered);
    // the main action gets a short gold pulse after the page loads instead
    const emailMain = !bookingUrl
    return (
      <div className="hire-me relative z-[3] flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {bookingUrl && (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => track('book')}
            className="btn btn--secondary btn--sm btn--pulse"
          >
            {BOOKING_LABEL}
          </a>
        )}
        <button
          type="button"
          onClick={onEmail}
          className={`btn btn--secondary btn--sm ${emailMain ? 'btn--pulse' : ''}`}
        >
          {status === 'copied' ? '✓ Email copied' : 'Email me'}
        </button>
        {pdf && (
          <a
            href={cv.pdf}
            download
            onClick={() => track('pdf')}
            aria-label="Download CV (PDF)"
            className="btn btn--secondary btn--sm"
          >
            Download CV
          </a>
        )}
        {feedback}
      </div>
    )
  }

  const showEmail = !bookingUrl || !mainOnly
  const emailClass = bookingUrl ? 'btn--secondary' : 'btn--primary'

  return (
    <div
      className="hire-me relative z-[3] flex flex-wrap items-center gap-2"
      // clicks here must not close the door underneath
      onClick={(e) => e.stopPropagation()}
    >
      {bookingUrl && (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => track('book')}
          className={`btn btn--primary ${sz}`}
        >
          {BOOKING_LABEL}
        </a>
      )}
      {showEmail && (
        <button type="button" onClick={onEmail} className={`btn ${emailClass} ${sz}`}>
          {status === 'copied' ? '✓ Email copied' : 'Email me'}
        </button>
      )}
      {linkedin && !mainOnly && (
        <a href={cv.linkedin} target="_blank" rel="noreferrer" onClick={() => track('linkedin')} className={secondary}>
          LinkedIn
        </a>
      )}
      {onShowCv && !mainOnly && (
        <button
          type="button"
          onClick={() => {
            track('fullcv')
            onShowCv()
          }}
          className={secondary}
        >
          Full CV
        </button>
      )}
      {pdf && !mainOnly && (
        <a
          href={cv.pdf}
          download
          onClick={() => track('pdf')}
          aria-label="Download CV (PDF)"
          className={secondary}
        >
          CV
          {/* Phosphor Icons, download-simple, bold to match the semibold text (https://phosphoricons.com, MIT) */}
          <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false" className="h-4 w-4">
            <path d="M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0Zm-108.49,8.49a12,12,0,0,0,17,0l40-40a12,12,0,0,0-17-17L140,115V32a12,12,0,0,0-24,0v83L96.49,95.51a12,12,0,0,0-17,17Z" />
          </svg>
        </a>
      )}
      {feedback}
    </div>
  )
}
