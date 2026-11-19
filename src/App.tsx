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
import { BackToTop } from './components/BackToTop'
import { CookieBanner } from './components/CookieBanner'
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
  // "Build a snowman" in the footer: the same game just for fun; it changes nothing
  const [showReplay, setShowReplay] = useState(false)
  const closeReplay = useCallback(() => setShowReplay(false), [])

  // Cookie question: a small non-blocking card. It appears 4 seconds after arrival or when the
  // first door is opened (whichever comes first), or 3 seconds after the snowman unlocks the
  // calendar; only if the visitor hasn't answered before.
  // "Not now" hides it for this visit; "Cookie settings" in the footer asks again any time.
  const [showCookie, setShowCookie] = useState(false)
  // bumped by "Cookie settings" so the question always starts fresh, even mid fade-out
  const [cookieKey, setCookieKey] = useState(0)
  const cookieDismissed = useRef(false)
  const offerCookie = () => {
    if (!cookieDismissed.current && readConsent() === null) setShowCookie(true)
  }
  // Reading the full CV is a calm moment to ask, also for visitors who chose "No, I'll wait"
  // and never unlock the calendar: offer the card 3 seconds after the CV opens.
  useEffect(() => {
    if (!showCv) return
    const t = window.setTimeout(offerCookie, 3000)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCv])

  // Not while the calendar is locked (the visitor is busy with "Too early!" and the snowman game):
  // then it comes 3 seconds after "Open the calendar" instead (see handleUnlock).
  useEffect(() => {
    if (locked) return
    const t = window.setTimeout(offerCookie, 4000)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (readConsent() === 'yes') startAnalytics()
  }, [])

  const handleConsent = useCallback((value: Consent) => {
    writeConsent(value)
    if (value === 'yes') startAnalytics()
    else stopAnalytics()
  }, [])

  const handleCookieDone = useCallback(() => {
    cookieDismissed.current = true
    setShowCookie(false)
  }, [])
  const handleCookieDismiss = useCallback(() => {
    cookieDismissed.current = true // not saved: asked again next visit
    setShowCookie(false)
  }, [])

  // Arrival: highlight today's door (it stays closed until the visitor opens it). Runs on page load
  // (if unlocked) or right after the snowman unlocks the calendar.
  const stopArrival = useRef<() => void>(() => {})
  const [highlightId, setHighlightId] = useState<number | null>(null)
  const startArrival = () => {
    // The page stays where it is (at the top); today's door is already in the first rows and
    // stands out with its gold pulse and red ribbon.
    const unhighlight = window.setTimeout(() => setHighlightId(null), 4500)
    setHighlightId(todayId)
    setAnnouncement(`Today is door ${todayId}.`)
    stopArrival.current = () => window.clearTimeout(unhighlight)
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
    window.setTimeout(offerCookie, 3000) // the cookie question waits until the calendar is open
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
    if (opening) {
      jingle()
      offerCookie()
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked])
  const closeDetails = () => {
    setDetailId(null)
  }

  return (
    <>
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-hidden={showCv || showGame || showReplay || detailId !== null || undefined}>
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
        {!showCv && !showCookie && !showGame && !showReplay && detailId === null && <BackToTop reducedMotion={reducedMotion} />}
        <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--ink-soft)]">
          <p>Made with React, TypeScript and an unreasonable amount of 🎄 in Gothenburg.</p>
          <div className="flex flex-wrap items-center gap-4">
            {!locked && (
              <button type="button" onClick={() => setShowReplay(true)} className="btn btn--secondary btn--sm">
                ⛄ Build a snowman
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setCookieKey((k) => k + 1)
                setShowCookie(true)
              }}
              className="underline underline-offset-2"
            >
              Cookie settings
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
      {showReplay && <SnowmanGame mode="replay" onWait={closeReplay} onUnlock={closeReplay} onBuilt={handleBuilt} />}
      {showGame && (
        <SnowmanGame onWait={handleWait} onUnlock={handleUnlock} onBuilt={handleBuilt} />
      )}
      {confetti && <Confetti onDone={endConfetti} />}
      {/* never on top of the snowman game; an unanswered card waits until the game is closed */}
      {showCookie && !showGame && !showReplay && (
        <CookieBanner
          key={cookieKey}
          reducedMotion={reducedMotion}
          onAnswer={handleConsent}
          onDismiss={handleCookieDismiss}
          onDone={handleCookieDone}
        />
      )}
    </>
  )
}
