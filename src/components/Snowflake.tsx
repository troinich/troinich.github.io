/**
 * Six snowflake designs, each a single six-armed crystal drawn as SVG lines.
 * One arm is described pointing up from the centre (0,0) toward (0,-50);
 * it is repeated six times around the centre.
 */
type Arm = string // SVG path data for one arm

const designs: Arm[] = [
  // 0 · classic: two pairs of V branches
  'M0 0V-48 M0-18l-12-10 M0-18l12-10 M0-32l-9-8 M0-32l9-8',
  // 1 · fern: three pairs of short branches near the tip
  'M0 0V-48 M0-24l-8-6 M0-24l8-6 M0-33l-7-5 M0-33l7-5 M0-41l-5-4 M0-41l5-4',
  // 2 · star: a diamond near the tip
  'M0 0V-48 M0-26l-8-8l8-8l8 8z',
  // 3 · ladder: two short crossbars and a fork at the end
  'M0 0V-46 M-6-32h12 M-4-20h8 M0-46l-7-7 M0-46l7-7',
  // 4 · dendrite: long branches with little side twigs
  'M0 0V-48 M0-16l-16-12 M0-16l16-12 M-9-22.5l-1-7 M9-22.5l1-7 M0-36l-8-7 M0-36l8-7',
  // 5 · ring: arm with a short V and a ring at the tip
  'M0 0V-40 M0-28l-8-7 M0-28l8-7 M-5-45a5 5 0 1 0 10 0a5 5 0 1 0-10 0',
]

export const SNOWFLAKE_DESIGNS = designs.length

export function Snowflake({ design, size }: { design: number; size: number }) {
  const arm = designs[design % designs.length]
  return (
    <svg
      width={size}
      height={size}
      viewBox="-55 -55 110 110"
      fill="none"
      stroke="currentColor"
      strokeWidth={size < 14 ? 7 : 5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <path key={deg} d={arm} transform={`rotate(${deg})`} />
      ))}
      {design % 3 === 1 && <circle r="6" fill="currentColor" stroke="none" />}
      {design % 3 === 2 && <path d="M0-10L8.7-5V5L0 10L-8.7 5V-5z" />}
    </svg>
  )
}
