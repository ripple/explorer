import { useTranslation } from 'react-i18next'
import { useTooltip } from './Tooltip'
import HoverIcon from '../images/hover.svg'

const TOOLTIP_Y_OFFSET = 60

type ConfBalanceTooltipKey =
  | 'confidential_balance_tooltip'
  | 'confidential_balance_row_tooltip'

interface ConfBalanceTooltipIconProps {
  tooltipKey: ConfBalanceTooltipKey
}

export const ConfBalanceTooltipIcon = ({
  tooltipKey,
}: ConfBalanceTooltipIconProps) => {
  const { t } = useTranslation()
  const { showTooltip, hideTooltip } = useTooltip()

  return (
    <HoverIcon
      className="hover"
      onMouseOver={(e: any) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, t(tooltipKey), {
          x: rect.left + rect.width / 2,
          y: rect.top - TOOLTIP_Y_OFFSET,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )
}
