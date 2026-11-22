/** A gingerbread man: whole, or being eaten in three bites. */
export type GingerbreadState = 'whole' | 'eaten'

const BROWN = '#b5713a' // crumbs

/**
 * The gingerbread man with his candy cane: design/gingerbread-candy-cane.png trimmed to his outline
 * as public/gingerbread.webp. Drawn on a 200×200 canvas so the bites can go on top.
 */
function Body() {
  return (
    <image
      href={`${import.meta.env.BASE_URL}gingerbread.webp`}
      x="5"
      y="0"
      width="190"
      height="200"
      preserveAspectRatio="xMidYMid meet"
    />
  )
}

const labels: Record<GingerbreadState, string> = {
  whole: 'A gingerbread man',
  eaten: 'A gingerbread man being eaten',
}

export function Gingerbread({
  state = 'whole',
  reducedMotion = false,
  className = 'h-14 w-14',
  decorative = false,
}: {
  state?: GingerbreadState
  reducedMotion?: boolean
  className?: string
  /** Purely decorative (e.g. an icon next to text): hidden from screen readers. */
  decorative?: boolean
}) {
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': labels[state] }

  if (state === 'eaten') {
    const bites = [
      [116, 10, 30], // the top of the head
      [184, 92, 34], // the whole right hand
      [152, 196, 34], // the right foot
    ]
    return (
      <svg viewBox="0 0 200 200" className={`cookie ${className} ${reducedMotion ? 'cookie--static' : ''}`} {...a11y}>
        <defs>
          <mask id="gb-bites">
            <rect width="200" height="200" fill="white" />
            {bites.map(([cx, cy, r], i) => (
              <circle key={i} className={`bite bite-${i + 1}`} cx={cx} cy={cy} r={r} fill="black" />
            ))}
          </mask>
        </defs>
        <g mask="url(#gb-bites)">
          <Body />
        </g>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} className={`crumb crumb-${i}`} cx={160 + (i % 3) * 8} cy={112 + i * 7} r={3} fill={BROWN} />
        ))}
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 200 200" className={`gingerbread ${className}`} {...a11y}>
      <Body />
    </svg>
  )
}
