import { doorById, gridOrder } from '../data/doors'
import { Door } from './Door'

interface Props {
  opened: Set<number>
  todayId: number
  /** Today's door, pulsing gold on arrival. */
  highlightId?: number | null
  /** Before December, until the snowman is built. */
  locked?: boolean
  onToggle: (id: number) => void
  onReadMore: (id: number) => void
  onShowCv?: () => void
}

export function Calendar({ opened, todayId, highlightId = null, locked = false, onToggle, onReadMore, onShowCv }: Props) {
  return (
    <ul className="calendar" aria-label="Advent calendar, 24 doors">
      {gridOrder.map((id) => {
        const door = doorById.get(id)!
        return (
          <Door
            key={id}
            door={door}
            open={opened.has(id)}
            today={id === todayId}
            highlight={id === highlightId}
            locked={locked}
            onToggle={onToggle}
            onReadMore={onReadMore}
            onShowCv={onShowCv}
          />
        )
      })}
    </ul>
  )
}
