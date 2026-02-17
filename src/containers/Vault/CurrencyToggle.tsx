import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useTooltip } from '../shared/components/Tooltip'
import './styles.scss'
import HoverIcon from '../shared/images/hover.svg'

const USD = 'USD'

interface Props {
  nativeCurrencyDisplay?: ReactNode // Optional JSX for button display (defaults to nativeCurrency)
  selected: string // The currently selected currency (nativeCurrency or "USD")
  onToggle: (currency: string) => void
  usdDisabled?: boolean // Disable USD option when no price is available
  usdLoading?: boolean // Show loading state while fetching price
}

export const CurrencyToggle = ({
  nativeCurrencyDisplay,
  selected,
  onToggle,
  usdDisabled = false,
  usdLoading = false,
}: Props) => {
  const { t } = useTranslation()
  const { showTooltip, hideTooltip } = useTooltip()

  const renderTextTooltip = (key: string) => (
    <HoverIcon
      className="hover"
      onMouseOver={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, t(`${key}_description`, { defaultValue: '' }), {
          x: rect.left + rect.width / 2,
          y: rect.top - 70,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )

  const handleUsdClick = () => {
    if (!usdDisabled && !usdLoading) {
      onToggle(USD)
    }
  }

  // Native is selected when selected is not USD (handles empty initial state)
  const isNativeSelected = selected !== USD

  return (
    <div className="currency-toggle-wrapper">
      <div className="currency-toggle">
        <button
          type="button"
          className={`toggle-option ${isNativeSelected ? 'active' : ''}`}
          onClick={() => onToggle('')}
        >
          {nativeCurrencyDisplay}
        </button>
        <span className="toggle-option-wrapper">
          <button
            type="button"
            className={`toggle-option ${!isNativeSelected ? 'active' : ''} ${usdDisabled || usdLoading ? 'disabled' : ''}`}
            onClick={handleUsdClick}
            disabled={usdDisabled || usdLoading}
          >
            {usdLoading ? '...' : USD}
          </button>
          {usdLoading && renderTextTooltip('currency_toggle_loading')}
          {!usdLoading && usdDisabled && renderTextTooltip('currency_toggle_unavailable')}
        </span>
      </div>
      {renderTextTooltip('currency_toggle')}
    </div>
  )
}
