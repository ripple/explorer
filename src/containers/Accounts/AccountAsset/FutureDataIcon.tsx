import ClockIcon from '../../shared/images/clock-icon.svg'
import { useTooltip } from '../../shared/components/Tooltip'
import './FutureDataIcon.scss'

interface FutureDataIconProps {
  message?: string
}
/**
 * Displays an icon with a tooltip indicating that the associated data will be available in a future release.
 *
 * Note: For the tooltip functionality to work, ensure that:
 * 1. The parent component is wrapped with `<TooltipProvider>`.
 * 2. A `<Tooltip tooltip={tooltip} />` component is rendered within the component tree.
 */
export const FutureDataIcon = ({
  message = 'This data will be provided in a future release.',
}: FutureDataIconProps) => {
  const { showTooltip, hideTooltip } = useTooltip()

  const handleShow = (e: React.MouseEvent | React.FocusEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    showTooltip('text', e as any, message, {
      // The tooltip position is adjusted to appear below and slightly to the right of the icon
      x: rect.left + window.scrollX + 10,
      y: rect.top + window.scrollY - 120,
    })
  }

  return (
    <span
      className="future-data"
      onMouseOver={handleShow}
      onMouseLeave={() => hideTooltip()}
      onFocus={handleShow}
      onBlur={() => hideTooltip()}
      tabIndex={0}
      role="button"
    >
      <ClockIcon className="clock-icon" />
    </span>
  )
}
