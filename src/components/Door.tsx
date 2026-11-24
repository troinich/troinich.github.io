import { useLayoutEffect, useRef } from 'react'
import type { Door as DoorData } from '../data/doors'
import { HireMeButtons } from './HireMeButtons'

interface Props {
  door: DoorData
  open: boolean
  /** This is today's door: it gets a badge and a ring. */
  today?: boolean
  /** Pulse gold to draw the eye (today's door on arrival). */
  highlight?: boolean
  /** The calendar is locked: show a padlock; clicking asks to build the snowman. */
  locked?: boolean
  /** On phones, take the whole row (a normal door that would otherwise sit alone in its row). */
  phoneFullWidth?: boolean
  onToggle: (id: number) => void
  onReadMore: (id: number) => void
}

export function Door({
  door,
  open,
  today = false,
  highlight = false,
  locked = false,
  phoneFullWidth = false,
  onToggle,
  onReadMore,
}: Props) {
  const panelId = `door-${door.id}-content`
  // While closed, the card is inert: nothing on it can be focused, clicked or read out. This
  // applies the moment the door closes, unlike visibility:hidden, which waits for the swing to
  // finish (Tab could otherwise land on door 24's buttons for 0.7s). React 18 doesn't pass
  // `inert` through as a prop, so it's set on the element.
  const backRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (backRef.current) backRef.current.inert = !open
  }, [open])
  const sizeClass = door.size ? `door--${door.size}` : ''
  const big = door.size === 'big'
  // Bigger doors have room for more, so they show part of the "Read more" content inline.
  const inlineDetails =
    door.size === 'big'
      ? door.details
      : door.size === 'tall'
        ? door.details.slice(0, 3)
        : door.size === 'wide'
          ? door.details.slice(0, 2)
          : []
  // The tools line lives only in the "Read more" card, so a door with tools always offers it
  const everythingShown = inlineDetails.length === door.details.length && !door.tools?.length

  return (
    <li
      id={`door-${door.id}`}
      className={`door ${sizeClass} ${phoneFullWidth ? 'door--phone-full' : ''} ${open ? 'is-open' : ''} ${today ? 'is-today' : ''} ${highlight ? 'is-highlighted' : ''}`}
    >
      <button
        type="button"
        className="door__hit"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Door ${door.id}${today ? ' (today)' : ''}, ${locked ? 'locked until December' : open ? 'open' : 'closed'}`}
        onClick={() => onToggle(door.id)}
      />
      <div className="door__inner">
        <div
          className="door__face door__front"
          style={{
            // shift the star field per door so no two skies look the same
            ['--sx' as string]: `${(door.id * 37) % 100}px`,
            ['--sy' as string]: `${(door.id * 53) % 100}px`,
            // a small, different tilt per door number (-1.2° to 1.2°), like slightly uneven printing
            ['--tilt' as string]: `${(((door.id * 7) % 5) - 2) * 0.6}deg`,
          }}
          aria-hidden="true"
        >
          {locked && <span className="door__lock">🔒</span>}
          {today && !open && !locked && (
            <span className="door__ribbon">
              <svg className="door__bow" viewBox="0 0 80 50">
                <path d="M40 25C28 6 8 4 6 16s16 18 34 9z" fill="#c8323c" stroke="#8e1f2a" strokeWidth="2" />
                <path d="M40 25C52 6 72 4 74 16s-16 18-34 9z" fill="#c8323c" stroke="#8e1f2a" strokeWidth="2" />
                <path d="M36 28l-10 20 8-3 4 5 2-22zM44 28l10 20-8-3-4 5-2-22z" fill="#b12a33" />
                <ellipse cx="40" cy="25" rx="7" ry="6" fill="#a8232d" />
              </svg>
            </span>
          )}
          <span
            className={`door__number font-display font-bold leading-none ${big ? 'text-7xl sm:text-8xl' : 'text-5xl sm:text-6xl'}`}
          >
            {door.id}
          </span>
        </div>
        {/* When open, the card sits above the click area: clicking the card closes the door,
            clicking "Read more" opens the details. Keyboard users use the door button. */}
        <div
          ref={backRef}
          id={panelId}
          className="door__face door__back flex flex-col gap-1.5 p-3 sm:p-4"
          aria-hidden={!open}
          onClick={() => open && onToggle(door.id)}
        >
          {door.photo && (
            <img
              src={`${import.meta.env.BASE_URL}${door.photo}`}
              alt="Natalia Troinich"
              loading="lazy"
              className="door__photo mx-auto mt-1 mb-4 rounded-full object-cover"
            />
          )}
          <h3 className={`mt-1 font-display font-bold leading-tight ${big ? 'text-xl sm:text-2xl' : 'text-xl'}`}>
            {door.headline}
          </h3>
          <p className={`mt-1.5 leading-snug text-[var(--ink-2)] ${big ? 'text-sm sm:text-base' : 'text-sm'}`}>
            {door.description}
          </p>
          {door.highlight && <p className="door__highlight my-2">{door.highlight}</p>}
          {/* Everything on the card is rendered even while the door is closed (the card is then
              hidden and aria-hidden), so the door already has its open height and opening it
              never pushes the rows below down */}
          {door.hireMe && (
            <div className="pt-1 pb-1">
              <HireMeButtons size="sm" pdf linkedin={false} place="door24" />
            </div>
          )}
          {inlineDetails.length > 0 && (
            <ul role="list" className="door__details space-y-1 text-sm leading-snug">
              {inlineDetails.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" aria-hidden="true" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}
          {!everythingShown && (
            <button
              type="button"
              tabIndex={open ? undefined : -1}
              className="door__more"
              onClick={(e) => {
                e.stopPropagation() // don't also close the door
                onReadMore(door.id)
              }}
              aria-label={`Read more about ${door.headline}`}
            >
              <span className="door__more-label">Read more</span>
              <span className="door__more-tree" aria-hidden="true">
                🎄
              </span>
            </button>
          )}
        </div>
      </div>
    </li>
  )
}
