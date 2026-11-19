import { COOKIE_IMAGE } from '../config'

/** A cookie that gets eaten in three bites, with falling crumbs. */
export function EatenCookie({ reducedMotion, image = COOKIE_IMAGE }: { reducedMotion: boolean; image?: string }) {
  const chips = [
    [70, 60, 7],
    [120, 55, 6],
    [95, 95, 8],
    [60, 115, 6],
    [130, 110, 7],
    [100, 140, 6],
    [140, 80, 5],
  ]
  const bites = [
    [168, 70, 30],
    [160, 125, 32],
    [128, 165, 30],
  ]
  return (
    <svg
      viewBox="0 0 200 200"
      className={`cookie mx-auto h-40 w-40 ${reducedMotion ? 'cookie--static' : ''}`}
      role="img"
      aria-label="A cookie being eaten"
    >
      <defs>
        <clipPath id="cookie-round">
          <circle cx="100" cy="100" r="80" />
        </clipPath>
        <mask id="bites">
          <rect width="200" height="200" fill="white" />
          {bites.map(([cx, cy, r], i) => (
            <circle key={i} className={`bite bite-${i + 1}`} cx={cx} cy={cy} r={r} fill="black" />
          ))}
        </mask>
      </defs>
      <g mask="url(#bites)">
        {image ? (
          <image
            href={`${import.meta.env.BASE_URL}${image}`}
            x="20"
            y="20"
            width="160"
            height="160"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#cookie-round)"
          />
        ) : (
          <>
            <circle cx="100" cy="100" r="80" fill="#d79b55" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#b97a3a" strokeWidth="6" />
            {chips.map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="#4a2c1a" />
            ))}
          </>
        )}
      </g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} className={`crumb crumb-${i}`} cx={150 + (i % 3) * 8} cy={110 + i * 6} r={3} fill="#c58a46" />
      ))}
    </svg>
  )
}
