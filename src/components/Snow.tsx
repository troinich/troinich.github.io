import { useMemo } from 'react'
import { Snowflake, SNOWFLAKE_DESIGNS } from './Snowflake'

/** Small seeded random number generator (mulberry32), so the snow looks the same on every render. */
function random(seed: number) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Single snowflakes in six designs drifting down the page, swaying and slowly spinning.
 * Flakes are spread out on purpose so they never fall in clumps: each one gets its own
 * column across the width (in shuffled order) and its own slot in time.
 */
export function Snow({ count = 30 }: { count?: number }) {
  const flakes = useMemo(() => {
    const rand = random(2026)

    // One column per flake, shuffled so neighbouring columns don't fall together.
    const columns = Array.from({ length: count }, (_, i) => i)
    for (let i = columns.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[columns[i], columns[j]] = [columns[j], columns[i]]
    }

    return columns.map((column, i) => {
      const size = 10 + rand() * 20 // 10–30px
      // bigger flakes are "closer": they fall faster and are brighter
      const duration = 26 - (size / 30) * 10 + rand() * 4
      return {
        design: Math.floor(rand() * SNOWFLAKE_DESIGNS),
        // the column's own slice of the width, with a little jitter inside it
        left: `${((column + 0.2 + rand() * 0.6) / count) * 100}%`,
        size,
        duration,
        // evenly staggered start times, so flakes enter one by one
        delay: -((i + rand() * 0.5) / count) * duration,
        sway: 3 + rand() * 4,
        drift: `${(rand() - 0.5) * 60}px`,
        opacity: 0.35 + (size / 30) * 0.55,
        spin: rand() > 0.5 ? '360deg' : '-360deg',
      }
    })
  }, [count])

  return (
    <div className="snow" aria-hidden="true">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="snow__fall"
          style={{
            left: f.left,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ['--drift' as string]: f.drift,
          }}
        >
          <span
            className="snow__flake"
            style={{
              opacity: f.opacity,
              animationDuration: `${f.sway}s, ${f.duration * 0.8}s`,
              ['--spin' as string]: f.spin,
            }}
          >
            <Snowflake design={f.design} size={Math.round(f.size)} />
          </span>
        </span>
      ))}
    </div>
  )
}
