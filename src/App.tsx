import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { displayOrder, doorById, doors } from './data/doors'
import { cv } from './data/cv'
import { todayDoorId } from './data/today'
import { useOpenedDoors } from './hooks/useOpenedDoors'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useMediaQuery } from './hooks/useMediaQuery'
import { Header } from './components/Header'
import { Calendar } from './components/Calendar'
import { CvView } from './components/CvView'
import { DoorDetails } from './components/DoorDetails'
import { Confetti } from './components/Confetti'
import { BackToTop } from './components/BackToTop'
import { CookieBanner } from './components/CookieBanner'
import { SnowmanGame } from './components/SnowmanGame'
import { isLocked, rememberUnlocked, unlockFromShareLink } from './data/lock'
import { isMuted, jingle, setMuted } from './sound'
import { readConsent, startAnalytics, stopAnalytics, writeConsent, type Consent } from './consent'

/** The pop-up covering the calendar: the full CV, a door's "Read more" card, or the snowman game
 * ('game' is the "Too early!" lockout, 'replay' the footer one that changes nothing). */
type Overlay =
  | { kind: 'none' }
  | { kind: 'cv' }
  | { kind: 'door'; id: number }
  | { kind: 'game' }
  | { kind: 'replay' }
const NONE: Overlay = { kind: 'none' }

export default function App() {
  const reducedMotion = useReducedMotion()
  const [todayId] = useState(() => todayDoorId())
  // "Open all doors" cascades in the order the doors are on screen (the same order Calendar shows)
  const phone = useMediaQuery('(max-width: 639px)')
  const order = useMemo(() => displayOrder(phone, todayId), [phone, todayId])
  const { opened, opening, toggle, openAll, closeAll } = useOpenedDoors(order, reducedMotion ? 0 : 60)
  const [confetti, setConfetti] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [muted, setMutedState] = useState(isMuted)

  const toggleMuted = () => {
    setMuted(!muted)
    setMutedState(!muted)
    if (muted) setTimeout(() => jingle(), 0) // unmuting plays a little preview
  }

  // Before December the calendar is locked until the visitor builds the snowman (or it's December),
  // unless they came through my shared link (?open).
  const [locked, setLocked] = useState(() => {
    unlockFromShareLink()
    return isLocked()
  })
  // Which pop-up covers the calendar. Only one at a time: opening one replaces the other
  // (e.g. "Full CV" on a door card closes the card). The cookie card is separate, see below.
  const [overlay, setOverlay] = useState<Overlay>(() => (locked ? { kind: 'game' } : NONE))
  const showCv = overlay.kind === 'cv'
  const showGame = overlay.kind === 'game' || overlay.kind === 'replay'
  const openCv = useCallback(() => setOverlay({ kind: 'cv' }), [])
  const closeOverlay = useCallback(() => setOverlay(NONE), [])

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

  // Arrival: today's door pulses gold (it stays closed until the visitor opens it). Runs on page load
  // (if unlocked) or right after the snowman unlocks the calendar. The page isn't scrolled.
  const [highlightId, setHighlightId] = useState<number | null>(null)
  // Bumped to queue a pulse. Wider screens pulse right away (today's door is in the first rows).
  // Phones, where the doors go 1–24, wait until the visitor actually gets to it: by scrolling down
  // or with "Go to today's door".
  const [pulseRequest, setPulseRequest] = useState(0)
  const startArrival = () => {
    setAnnouncement(`Today is door ${todayId}.`)
    setPulseRequest((n) => n + 1)
  }

  useEffect(() => {
    if (pulseRequest === 0) return
    let unhighlight: number | undefined
    const pulse = () => {
      setHighlightId(todayId)
      unhighlight = window.setTimeout(() => setHighlightId(null), 4500)
    }
    const door = document.getElementById(`door-${todayId}`)
    const phone = window.matchMedia?.('(max-width: 639px)').matches
    if (!phone || !door || typeof IntersectionObserver === 'undefined') {
      pulse()
      return () => window.clearTimeout(unhighlight)
    }
    const watch = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        watch.disconnect()
        pulse()
      },
      { threshold: 0.6 },
    )
    watch.observe(door)
    return () => {
      watch.disconnect()
      window.clearTimeout(unhighlight)
    }
  }, [pulseRequest, todayId])

  useEffect(() => {
    if (!locked) startArrival()
    // Runs once, on page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The snowman game
  // "No, I'll wait" (or Escape): show the full CV instead, so nobody leaves empty-handed
  const handleWait = openCv
  const handleBuilt = useCallback(() => {
    jingle({ volume: 0.07 })
    if (!reducedMotion) setConfetti(true)
  }, [reducedMotion])
  const handleUnlock = () => {
    rememberUnlocked()
    closeAll() // the calendar starts fresh: every door closed
    setLocked(false)
    setOverlay(NONE)
    window.setTimeout(startArrival, 0)
    window.setTimeout(offerCookie, 3000) // the cookie question waits until the calendar is open
  }

  const total = doors.length
  const NONE_OPEN = useRef(new Set<number>()).current
  const shownOpen = locked ? NONE_OPEN : opened

  const handleToggle = (id: number) => {
    if (locked) return setOverlay({ kind: 'game' })
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

  // Phones only (the doors there are in plain order, so today's door can be far down):
  // scroll to today's door, which pulses when it arrives on screen; opening it is left to the visitor.
  const goToToday = () => {
    const door = document.getElementById(`door-${todayId}`)
    door?.scrollIntoView?.({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
    setHighlightId(null) // off first, so the pulse restarts even if it was still running
    setPulseRequest((n) => n + 1)
  }

  const handleOpenAll = () => {
    if (locked) return setOverlay({ kind: 'game' })
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
  const closeCv = useCallback(() => setOverlay(locked ? { kind: 'game' } : NONE), [locked])

  return (
    <>
      <div
        className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6"
        aria-hidden={overlay.kind !== 'none' || undefined}
      >
        <Header
          openedCount={shownOpen.size}
          opening={opening}
          total={total}
          muted={muted}
          onToggleMuted={toggleMuted}
          onOpenAll={handleOpenAll}
          onCloseAll={handleCloseAll}
          onShowCv={openCv}
          onGoToToday={locked ? undefined : goToToday}
        />
        <main>
          <h2 className="sr-only">Calendar doors</h2>
          <Calendar
            opened={shownOpen}
            todayId={todayId}
            highlightId={highlightId}
            locked={locked}
            onToggle={handleToggle}
            onShowCv={openCv}
            onReadMore={(id) => setOverlay({ kind: 'door', id })}
          />
        </main>
        {overlay.kind === 'none' && !showCookie && (
          <BackToTop reducedMotion={reducedMotion} />
        )}
        <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--ink-soft)]">
          <p>Made with React, TypeScript and an unreasonable amount of 🎄 in Gothenburg.</p>
          <div className="flex flex-wrap items-center gap-4">
            {!locked && (
              <button type="button" onClick={() => setOverlay({ kind: 'replay' })} className="btn btn--secondary btn--sm btn--snow">
                Build a snowman
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setCookieKey((k) => k + 1)
                setShowCookie(true)
              }}
              className="underline underline-offset-2 transition-colors duration-150 hover:text-[var(--gold)]"
            >
              Cookie settings
            </button>
            <a href={cv.linkedin} target="_blank" rel="noreferrer" className="underline underline-offset-2 transition-colors duration-150 hover:text-[var(--gold)]">
              Say hi on LinkedIn
            </a>
          </div>
        </footer>
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      {overlay.kind === 'door' && (
        <DoorDetails door={doorById.get(overlay.id)!} onClose={closeOverlay} onShowCv={openCv} />
      )}
      {overlay.kind === 'cv' && <CvView onClose={closeCv} />}
      {overlay.kind === 'replay' && (
        <SnowmanGame mode="replay" onWait={closeOverlay} onUnlock={closeOverlay} onBuilt={handleBuilt} />
      )}
      {overlay.kind === 'game' && <SnowmanGame onWait={handleWait} onUnlock={handleUnlock} onBuilt={handleBuilt} />}
      {confetti && <Confetti onDone={endConfetti} />}
      {/* never on top of the snowman game; an unanswered card waits until the game is closed */}
      {showCookie && !showGame && (
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
