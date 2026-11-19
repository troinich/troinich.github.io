import { useCallback, useEffect, useState } from 'react'
import { doorById, doors, gridOrder } from './data/doors'
import { cv } from './data/cv'
import { todayDoorId } from './data/today'
import { useOpenedDoors } from './hooks/useOpenedDoors'
import { useReducedMotion } from './hooks/useReducedMotion'
import { Header } from './components/Header'
import { Calendar } from './components/Calendar'
import { CvView } from './components/CvView'
import { DoorDetails } from './components/DoorDetails'
import { Confetti } from './components/Confetti'
import { CookiePrompt } from './components/CookiePrompt'
import { isMuted, jingle, setMuted } from './sound'
import { readConsent, startAnalytics, writeConsent, type Consent } from './consent'

export default function App() {
  const reducedMotion = useReducedMotion()
  const { opened, toggle, open, openAll, closeAll } = useOpenedDoors(gridOrder, reducedMotion ? 0 : 60)
  const [showCv, setShowCv] = useState(false)
  const [detailId, setDetailId] = useState<number | null>(null)
  const [confetti, setConfetti] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [muted, setMutedState] = useState(isMuted)

  const toggleMuted = () => {
    setMuted(!muted)
    setMutedState(!muted)
    if (muted) setTimeout(() => jingle(), 0) // unmuting plays a little preview
  }
  const [todayId] = useState(() => todayDoorId())

  // Cookie question: asked on first visit, and again from "Cookie settings".
  const [showCookie, setShowCookie] = useState(() => readConsent() === null)
  const [arrivalReady, setArrivalReady] = useState(() => readConsent() !== null)

  useEffect(() => {
    if (readConsent() === 'yes') startAnalytics()
  }, [])

  const handleConsent = useCallback((value: Consent) => {
    writeConsent(value)
    if (value === 'yes') startAnalytics()
  }, [])

  const handleCookieDone = useCallback(() => {
    setShowCookie(false)
    setArrivalReady(true)
  }, [])

  // On arrival (after the cookie question): bring today's door into view, open it,
  // then show its "Read more" card, just as if the visitor had clicked it.
  useEffect(() => {
    if (!arrivalReady) return
    const el = document.getElementById(`door-${todayId}`)
    el?.scrollIntoView?.({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' })
    const door = doorById.get(todayId)!
    const openTimer = window.setTimeout(() => {
      open(todayId)
      jingle()
      setAnnouncement(`Today is door ${todayId}: ${door.headline}.`)
    }, reducedMotion ? 0 : 600)
    const detailsTimer = window.setTimeout(() => setDetailId(todayId), reducedMotion ? 0 : 1300)
    return () => {
      window.clearTimeout(openTimer)
      window.clearTimeout(detailsTimer)
    }
    // Runs once, when the visitor has answered the cookie question (or answered on an earlier visit).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalReady])

  const total = doors.length

  const handleToggle = (id: number) => {
    const opening = !opened.has(id)
    toggle(id)
    const door = doorById.get(id)!
    setAnnouncement(opening ? `Door ${id}: ${door.headline}. ${door.description}` : `Door ${id} closed.`)
    if (opening) jingle()
    if (opening && id === 24 && !reducedMotion) setConfetti(true)
  }

  const handleOpenAll = () => {
    openAll()
    jingle({ volume: 0.07 })
    setAnnouncement(`All ${total} doors opened.`)
  }

  const handleCloseAll = () => {
    closeAll()
    setAnnouncement('All doors closed.')
  }

  const endConfetti = useCallback(() => setConfetti(false), [])
  const closeCv = useCallback(() => setShowCv(false), [])
  const closeDetails = useCallback(() => setDetailId(null), [])

  return (
    <>
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-hidden={showCv || showCookie || detailId !== null || undefined}>
        <Header
          openedCount={opened.size}
          total={total}
          muted={muted}
          onToggleMuted={toggleMuted}
          onOpenAll={handleOpenAll}
          onCloseAll={handleCloseAll}
          onShowCv={() => setShowCv(true)}
        />
        <main>
          <h2 className="sr-only">Calendar doors</h2>
          <Calendar
            opened={opened}
            todayId={todayId}
            onToggle={handleToggle}
            onReadMore={(id) => {
                        setDetailId(id)
            }}
          />
        </main>
        <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--ink-soft)]">
          <p>Made with React, TypeScript and an unreasonable amount of 🎄 in Gothenburg.</p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setShowCookie(true)} className="underline underline-offset-2">
              🍪 Cookie settings
            </button>
            <a href={cv.linkedin} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              Say hi on LinkedIn
            </a>
          </div>
        </footer>
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      {detailId !== null && (
        <DoorDetails
          door={doorById.get(detailId)!}
          today={detailId === todayId}
          onClose={closeDetails}
          onShowCv={() => {
            setDetailId(null)
            setShowCv(true)
          }}
        />
      )}
      {showCv && <CvView onClose={closeCv} />}
      {confetti && <Confetti onDone={endConfetti} />}
      {showCookie && (
        <CookiePrompt reducedMotion={reducedMotion} onAnswer={handleConsent} onDone={handleCookieDone} />
      )}
    </>
  )
}
