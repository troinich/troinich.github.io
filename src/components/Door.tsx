import type { Door as DoorData } from '../data/doors'
import { HireMeButtons } from './HireMeButtons'

const tagColor: Record<NonNullable<DoorData['category']>, string> = {
  Skill: 'var(--tag-skill)',
  Achievement: 'var(--tag-achievement)',
  Fact: 'var(--tag-fact)',
}

interface Props {
  door: DoorData
  open: boolean
  /** This is today's door: it gets a badge and a ring. */
  today?: boolean
  /** Pulse gold to draw the eye (today's door on arrival). */
  highlight?: boolean
  /** The calendar is locked: show a padlock; clicking asks to build the snowman. */
  locked?: boolean
  onToggle: (id: number) => void
  onReadMore: (id: number) => void
  /** Opens the full CV page (used by door 24's "Full CV" button). */
  onShowCv?: () => void
}

export function Door({ door, open, today = false, highlight = false, locked = false, onToggle, onReadMore, onShowCv }: Props) {
  const panelId = `door-${door.id}-content`
  const sizeClass = door.size ? `door--${door.size}` : ''
  const big = door.size === 'big'
  // Bigger doors have room for more, so they show part of the "Read more" content inline.
  const inlineDetails = door.size === 'big' ? door.details : door.size === 'tall' ? door.details.slice(0, 3) : door.size === 'wide' ? door.details.slice(0, 2) : []
  const inlineTags = door.size === 'big' || door.size === 'tall' ? door.tags : []
  const everythingShown = inlineDetails.length === door.details.length && inlineTags.length === door.tags.length

  return (
    <li
      id={`door-${door.id}`}
      className={`door ${sizeClass} ${open ? 'is-open' : ''} ${today ? 'is-today' : ''} ${highlight ? 'is-highlighted' : ''}`}
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
          <span className={`door__number font-display font-bold leading-none ${big ? 'text-7xl sm:text-8xl' : 'text-5xl sm:text-6xl'}`}>
            {door.id}
          </span>
        </div>
        {/* When open, the card sits above the click area: clicking the card closes the door,
            clicking "Read more" opens the details. Keyboard users use the door button. */}
        <div
          id={panelId}
          className="door__face door__back flex flex-col gap-1.5 p-3 sm:p-4"
          aria-hidden={!open}
          onClick={() => open && onToggle(door.id)}
        >
          {door.category && (
            <div className="flex justify-end">
              <span
                className="rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold tracking-wide uppercase"
                style={{ color: tagColor[door.category], borderColor: tagColor[door.category] }}
              >
                {door.category}
              </span>
            </div>
          )}
          {door.photo && (
            <img
              src={`${import.meta.env.BASE_URL}${door.photo}`}
              alt="Natalia Troinich"
              loading="lazy"
              className="door__photo mx-auto mt-1 mb-4 rounded-full object-cover"
            />
          )}
          <h3 className={`mt-1 font-display font-bold leading-tight ${big ? 'text-xl sm:text-2xl' : 'text-base'}`}>
            {door.headline}
          </h3>
          <p className={`mt-1.5 leading-snug text-[var(--ink-2)] ${big ? 'text-sm sm:text-base' : 'text-sm'}`}>
            {door.description}
          </p>
          {door.highlight && <p className="door__highlight my-2">{door.highlight}</p>}
          {door.hireMe && open && (
            <div className="pt-1 pb-1">
              <HireMeButtons size="sm" onShowCv={onShowCv} />
            </div>
          )}
          {inlineDetails.length > 0 && (
            <ul className="door__details space-y-1 text-sm leading-snug">
              {inlineDetails.map((d) => (
                <li key={d} className="flex gap-1.5">
                  <span className="text-[var(--gold)]" aria-hidden="true">
                    ✦
                  </span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}
          {inlineTags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Tools and topics">
              {inlineTags.map((t) => (
                <li key={t} className="door__tag rounded-full border px-2 py-0.5 text-xs font-medium">
                  {t}
                </li>
              ))}
            </ul>
          )}
          {open && !everythingShown && (
            <button
              type="button"
              className="door__more"
              onClick={(e) => {
                e.stopPropagation() // don't also close the door
                onReadMore(door.id)
              }}
              aria-label={`Read more about ${door.headline}`}
            >
              Read more{' '}
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
