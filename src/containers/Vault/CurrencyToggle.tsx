import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useTooltip } from '../shared/components/Tooltip'
import './styles.scss'

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

  const handleUsdClick = () => {
    if (!usdDisabled && !usdLoading) {
      onToggle(USD)
    }
  }

  const getUsdTooltip = () => {
    if (usdLoading) return t('currency_toggle_loading')
    if (usdDisabled) return t('currency_toggle_unavailable')
    return ''
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
        <span
          className="toggle-option-wrapper"
          onMouseEnter={(e) => {
            const tooltip = getUsdTooltip()
            if (tooltip) showTooltip('text', e, tooltip)
          }}
          onMouseLeave={hideTooltip}
        >
          <button
            type="button"
            className={`toggle-option ${!isNativeSelected ? 'active' : ''} ${usdDisabled || usdLoading ? 'disabled' : ''}`}
            onClick={handleUsdClick}
            disabled={usdDisabled || usdLoading}
          >
            {usdLoading ? '...' : USD}
          </button>
        </span>
      </div>
      <span
        className="toggle-help"
        onMouseEnter={(e) => showTooltip('text', e, t('currency_toggle_help'))}
        onMouseLeave={hideTooltip}
      >
        ?
      </span>
    </div>
  )
}
