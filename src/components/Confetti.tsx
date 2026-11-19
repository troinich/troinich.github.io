import { useEffect, useMemo } from 'react'

const pieces = ['🎉', '✨', '❄️', '🎁', '⭐', '💙']

export function Confetti({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 1500)
    return () => window.clearTimeout(t)
  }, [onDone])

  const bits = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2
        const dist = 180 + (i % 5) * 50
        return {
          char: pieces[i % pieces.length],
          x: `${Math.cos(angle) * dist}px`,
          y: `${Math.sin(angle) * dist}px`,
          r: `${(i % 2 ? 1 : -1) * (90 + i * 13)}deg`,
        }
      }),
    [],
  )

  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} style={{ ['--x' as string]: b.x, ['--y' as string]: b.y, ['--r' as string]: b.r }}>
          {b.char}
        </span>
      ))}
    </div>
  )
}
