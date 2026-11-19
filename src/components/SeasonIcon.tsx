export type Season = 'autumn' | 'winter' | 'spring' | 'summer'

/** Season of a date (northern hemisphere). December counts as winter but is never locked. */
export function seasonOf(date: Date = new Date()): Season {
  const m = date.getMonth() // 0 = January
  if (m >= 8 && m <= 10) return 'autumn'
  if (m >= 2 && m <= 4) return 'spring'
  if (m >= 5 && m <= 7) return 'summer'
  return 'winter'
}

const images: Record<Season, { src: string; alt: string; cutout?: boolean }> = {
  autumn: { src: 'seasons/autumn.png', alt: 'A painted autumn maple leaf in red, orange and yellow', cutout: true },
  winter: { src: 'seasons/winter.jpg', alt: 'A kitten asleep in a colourful knitted blanket' },
  spring: { src: 'seasons/spring.jpg', alt: 'Snowdrops flowering through the snow' },
  summer: { src: 'seasons/summer.jpg', alt: 'A striped beach umbrella on white sand by a turquoise sea' },
}

/** A picture for the "Too early!" message, matching the time of year. */
export function SeasonIcon({ season, className = '' }: { season: Season; className?: string }) {
  const { src, alt, cutout } = images[season]
  return (
    <img
      src={`${import.meta.env.BASE_URL}${src}`}
      alt={alt}
      className={`season-image ${cutout ? 'season-image--cutout' : 'season-image--photo'} ${className}`}
    />
  )
}
