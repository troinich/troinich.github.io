import type { Door as DoorData } from '../data/doors'

const tagColor: Record<DoorData['category'], string> = {
  Skill: 'var(--tag-skill)',
  Achievement: 'var(--tag-achievement)',
  Fact: 'var(--tag-fact)',
}

interface Props {
  door: DoorData
  open: boolean
  /** This is today's door: it gets a badge and a ring. */
  today?: boolean
  onToggle: (id: number) => void
  onReadMore: (id: number) => void
}

export function Door({ door, open, today = false, onToggle, onReadMore }: Props) {
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
      className={`door ${sizeClass} ${open ? 'is-open' : ''} ${today ? 'is-today' : ''}`}
    >
      {today && <span className="door__today-badge">Today</span>}
      <button
        type="button"
        className="door__hit"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Door ${door.id}${today ? ' (today)' : ''}, ${open ? 'open' : 'closed'}`}
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
          <div className="flex justify-end">
            <span
              className="rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide uppercase"
              style={{ color: tagColor[door.category], borderColor: tagColor[door.category] }}
            >
              {door.category}
            </span>
          </div>
          <h3 className={`mt-1 font-display font-bold leading-tight ${big ? 'text-xl sm:text-2xl' : 'text-base'}`}>
            {door.headline}
          </h3>
          <p className={`mt-1.5 leading-snug ${big ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
            {door.description}
          </p>
          {inlineDetails.length > 0 && (
            <ul className={`door__details space-y-1 leading-snug ${big ? 'text-sm' : 'text-xs sm:text-sm'}`}>
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
                <li key={t} className="door__tag rounded-full border px-2 py-0.5 text-[0.7rem] font-medium">
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
