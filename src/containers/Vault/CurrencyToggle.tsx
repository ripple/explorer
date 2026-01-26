import { useTranslation } from 'react-i18next'
import { useTooltip } from '../shared/components/Tooltip'
import './styles.scss'

export type DisplayCurrency = 'xrp' | 'usd'

interface Props {
  nativeCurrency: string // e.g., "XRP" or "RLUSD"
  selected: DisplayCurrency
  onToggle: (currency: DisplayCurrency) => void
  usdDisabled?: boolean // Disable USD option when no price is available
  usdLoading?: boolean // Show loading state while fetching price
}

export const CurrencyToggle = ({
  nativeCurrency,
  selected,
  onToggle,
  usdDisabled = false,
  usdLoading = false,
}: Props) => {
  const { t } = useTranslation()
  const { showTooltip, hideTooltip } = useTooltip()

  const handleUsdClick = () => {
    if (!usdDisabled && !usdLoading) {
      onToggle('usd')
    }
  }

  const getUsdTooltip = () => {
    if (usdLoading) return t('currency_toggle_loading')
    if (usdDisabled) return t('currency_toggle_unavailable')
    return ''
  }

  return (
    <div className="currency-toggle">
      <button
        type="button"
        className={`toggle-option ${selected === 'xrp' ? 'active' : ''}`}
        onClick={() => onToggle('xrp')}
      >
        {nativeCurrency}
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
          className={`toggle-option ${selected === 'usd' ? 'active' : ''} ${usdDisabled || usdLoading ? 'disabled' : ''}`}
          onClick={handleUsdClick}
          disabled={usdDisabled || usdLoading}
        >
          {usdLoading ? '...' : 'USD'}
        </button>
      </span>
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
