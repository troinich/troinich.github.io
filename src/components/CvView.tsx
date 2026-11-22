import { useRef } from 'react'
import { useModal } from '../hooks/useModal'
import { cv, type Role } from '../data/cv'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h3 className="border-b border-[var(--line)] pb-1 text-xs font-semibold tracking-[0.2em] text-[var(--ink-soft)] uppercase">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function Roles({ roles }: { roles: Role[] }) {
  return (
    <div className="flex flex-col gap-5">
      {roles.map((r) => (
        <article key={`${r.title}-${r.period}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h4 className="font-semibold">
              {r.title}, <span className="font-normal italic">{r.company}</span>
            </h4>
            <span className="text-sm text-[var(--ink-soft)]">{r.period}</span>
          </div>
          {r.intro && <p className="mt-1 text-sm italic text-[var(--ink-soft)]">{r.intro}</p>}
          {r.bullets.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              {r.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  )
}

export function CvView({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useModal(dialogRef, closeRef, onClose)

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-[var(--bg)]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-title"
        className="mx-auto max-w-3xl px-4 pb-16 sm:px-8"
      >
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 bg-[var(--bg)] py-4">
          <button ref={closeRef} type="button" onClick={onClose} className="btn btn--secondary btn--sm">
            ← Back to calendar
          </button>
          <a href={cv.pdf} download className="btn btn--primary btn--sm">
            Download PDF
          </a>
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-10">
          <header className="text-center">
            <h2 id="cv-title" className="font-display text-3xl font-bold sm:text-4xl">
              {cv.name}
            </h2>
            <p className="mt-1 italic text-[var(--ink-soft)]">{cv.title}</p>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">
              {cv.location} ·{' '}
              <a href={cv.linkedin} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                LinkedIn
              </a>
            </p>
          </header>

          <Section title="Profile">
            <div className="space-y-3 text-sm leading-relaxed">
              {cv.profile.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Section>

          <Section title="Experience">
            <Roles roles={cv.experience} />
          </Section>

          <Section title="Skills">
            <dl className="space-y-1.5 text-sm leading-relaxed">
              {cv.skills.map(([k, v]) => (
                <div key={k}>
                  <dt className="inline font-semibold">{k}: </dt>
                  <dd className="inline">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="Earlier career">
            <Roles roles={cv.earlierCareer} />
          </Section>

          <Section title="Education">
            <Roles roles={cv.education} />
          </Section>

          <Section title="Languages">
            <p className="text-sm">{cv.languages.join(' · ')}</p>
          </Section>
        </div>
      </div>
    </div>
  )
}
