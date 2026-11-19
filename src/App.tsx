import { useCallback, useEffect, useRef, useState } from 'react'
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
import { SnowmanGame } from './components/SnowmanGame'
import { isLocked, rememberUnlocked } from './data/lock'
import { isMuted, jingle, setMuted } from './sound'
import { readConsent, startAnalytics, stopAnalytics, writeConsent, type Consent } from './consent'

export default function App() {
  const reducedMotion = useReducedMotion()
  const { opened, toggle, openAll, closeAll } = useOpenedDoors(gridOrder, reducedMotion ? 0 : 60)
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

  // Before December the calendar is locked until the visitor builds the snowman (or it's December).
  const [locked, setLocked] = useState(() => isLocked())
  const [showGame, setShowGame] = useState(locked)

  // Cookie question: comes after the first thing the visitor sees (today's door card, or the
  // "Too early!" message), when they close it or jump to the full CV, and only if they haven't
  // answered before. "Cookie settings" in the footer asks again any time.
  const [showCookie, setShowCookie] = useState(false)
  const firstDialogOpen = useRef(locked)
  const askCookieAfterFirstDialog = () => {
    if (!firstDialogOpen.current) return
    firstDialogOpen.current = false
    if (readConsent() === null) setShowCookie(true)
  }

  useEffect(() => {
    if (readConsent() === 'yes') startAnalytics()
  }, [])

  const handleConsent = useCallback((value: Consent) => {
    writeConsent(value)
    if (value === 'yes') startAnalytics()
    else stopAnalytics()
  }, [])

  const handleCookieDone = useCallback(() => setShowCookie(false), [])

  // Arrival: bring today's door into view and highlight it (it stays closed until the visitor
  // opens it). Runs on page load (if unlocked) or right after the snowman unlocks the calendar.
  // If the visitor clicks, taps, scrolls or presses a key first, the scrolling stops where it is.
  const stopArrival = useRef<() => void>(() => {})
  const [highlightId, setHighlightId] = useState<number | null>(null)
  const startArrival = () => {
    const el = document.getElementById(`door-${todayId}`)
    el?.scrollIntoView?.({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' })
    const events = ['pointerdown', 'click', 'keydown', 'wheel', 'touchmove'] as const
    const stop = () => events.forEach((e) => window.removeEventListener(e, onVisitorAction, true))
    const onVisitorAction = () => {
      stop()
      // halt the smooth scroll toward today's door
      try {
        window.scrollTo({ top: window.scrollY, behavior: 'auto' })
      } catch {
        // not available (e.g. in tests)
      }
    }
    events.forEach((e) => window.addEventListener(e, onVisitorAction, { capture: true, passive: true }))
    const unhighlight = window.setTimeout(() => setHighlightId(null), 4500)
    setHighlightId(todayId)
    setAnnouncement(`Today is door ${todayId}.`)
    // the first card or CV the visitor closes brings the cookie question
    firstDialogOpen.current = true
    stopArrival.current = () => {
      stop()
      window.clearTimeout(unhighlight)
    }
  }

  useEffect(() => {
    if (!locked) startArrival()
    return () => stopArrival.current()
    // Runs once, on page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The snowman game
  // "No, I'll wait" (or Escape): show the full CV instead, so nobody leaves empty-handed
  const handleWait = useCallback(() => {
    setShowGame(false)
    setShowCv(true)
    askCookieAfterFirstDialog()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleBuilt = useCallback(() => {
    jingle({ volume: 0.07 })
    if (!reducedMotion) setConfetti(true)
  }, [reducedMotion])
  const handleUnlock = () => {
    rememberUnlocked()
    closeAll() // the calendar starts fresh: every door closed
    setLocked(false)
    setShowGame(false)
    window.setTimeout(startArrival, 0)
  }

  const total = doors.length
  const NONE_OPEN = useRef(new Set<number>()).current
  const shownOpen = locked ? NONE_OPEN : opened

  const handleToggle = (id: number) => {
    if (locked) return setShowGame(true)
    setHighlightId(null)
    const opening = !opened.has(id)
    toggle(id)
    const door = doorById.get(id)!
    setAnnouncement(opening ? `Door ${id}: ${door.headline}. ${door.description}` : `Door ${id} closed.`)
    if (opening) jingle()
    if (opening && id === 24 && !reducedMotion) setConfetti(true)
  }

  const handleOpenAll = () => {
    if (locked) return setShowGame(true)
    openAll()
    jingle({ volume: 0.07 })
    setAnnouncement(`All ${total} doors opened.`)
  }

  const handleCloseAll = () => {
    closeAll()
    setAnnouncement('All doors closed.')
  }

  const endConfetti = useCallback(() => setConfetti(false), [])
  // Leaving the CV goes back to the calendar; if it's still locked, offer the snowman game again
  const closeCv = useCallback(() => {
    setShowCv(false)
    if (locked) setShowGame(true)
    else askCookieAfterFirstDialog()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked])
  const closeDetails = () => {
    setDetailId(null)
    askCookieAfterFirstDialog()
  }

  return (
    <>
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-hidden={showCv || showCookie || showGame || detailId !== null || undefined}>
        <Header
          openedCount={shownOpen.size}
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
            opened={shownOpen}
            todayId={todayId}
            highlightId={highlightId}
            locked={locked}
            onToggle={handleToggle}
            onShowCv={() => setShowCv(true)}
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
            askCookieAfterFirstDialog()
          }}
        />
      )}
      {showCv && <CvView onClose={closeCv} />}
      {showGame && (
        <SnowmanGame onWait={handleWait} onUnlock={handleUnlock} onBuilt={handleBuilt} />
      )}
      {confetti && <Confetti onDone={endConfetti} />}
      {showCookie && (
        <CookiePrompt reducedMotion={reducedMotion} onAnswer={handleConsent} onDone={handleCookieDone} />
      )}
    </>
  )
}
