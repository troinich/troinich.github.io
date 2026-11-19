import { doorById, gridOrder, orderWithTodayFirst, phoneFullWidth, phoneOrder } from '../data/doors'
import { useMediaQuery } from '../hooks/useMediaQuery'
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

export function Calendar({
  opened,
  todayId,
  highlightId = null,
  locked = false,
  onToggle,
  onReadMore,
  onShowCv,
}: Props) {
  // Phones: plain order (today's door first, then 1–24), so the doors read like a list.
  // Wider screens: the shuffled advent calendar look, with today's door in the first rows.
  const phone = useMediaQuery('(max-width: 639px)')
  const order = phone ? phoneOrder(todayId) : orderWithTodayFirst(gridOrder, todayId)
  const fullWidth = phone ? phoneFullWidth(order) : new Set<number>()
  return (
    <ul className="calendar" aria-label="Advent calendar, 24 doors">
      {order.map((id) => {
        const door = doorById.get(id)!
        return (
          <Door
            key={id}
            door={door}
            open={opened.has(id)}
            today={id === todayId}
            phoneFullWidth={fullWidth.has(id)}
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
