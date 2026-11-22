import { useEffect, useRef, useState } from 'react'
import { cv } from '../data/cv'
import { copyEmail, emailText, openEmail } from '../data/contact'

type Status = 'idle' | 'copied' | 'show-address'

/** "Email me", "LinkedIn" and "Full CV" call-to-action buttons for door 24. */
export function HireMeButtons({ size = 'md', onShowCv }: { size?: 'sm' | 'md'; onShowCv?: () => void }) {
  const sz = size === 'sm' ? 'btn--sm' : ''
  const [status, setStatus] = useState<Status>('idle')
  const reset = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(reset.current), [])

  // No email app opened: copy the address instead and say so
  const onNoEmailApp = async () => {
    const ok = await copyEmail()
    setStatus(ok ? 'copied' : 'show-address')
    window.clearTimeout(reset.current)
    if (ok) reset.current = window.setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <div
      className="hire-me relative z-[3] flex flex-wrap items-center gap-2"
      // clicks here must not close the door underneath
      onClick={(e) => e.stopPropagation()}
    >
      <button type="button" onClick={() => openEmail(onNoEmailApp)} className={`btn btn--primary ${sz}`}>
        {status === 'copied' ? '✓ Email copied' : 'Email me'}
      </button>
      <a href={cv.linkedin} target="_blank" rel="noreferrer" className={`btn btn--secondary ${sz}`}>
        LinkedIn
      </a>
      {onShowCv && (
        <button type="button" onClick={onShowCv} className={`btn btn--secondary ${sz}`}>
          Full CV
        </button>
      )}
      {status === 'show-address' && (
        <p className="w-full text-sm text-[var(--ink)]">
          Copy my email: <span className="font-semibold select-all">{emailText()}</span>
        </p>
      )}
      <span className="sr-only" aria-live="polite">
        {status === 'copied' ? 'Email address copied to the clipboard' : ''}
      </span>
    </div>
  )
}
