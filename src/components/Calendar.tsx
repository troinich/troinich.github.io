import { doorById, gridOrder } from '../data/doors'
import { Door } from './Door'

interface Props {
  opened: Set<number>
  todayId: number
  onToggle: (id: number) => void
  onReadMore: (id: number) => void
}

export function Calendar({ opened, todayId, onToggle, onReadMore }: Props) {
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
            onToggle={onToggle}
            onReadMore={onReadMore}
          />
        )
      })}
    </ul>
  )
}
