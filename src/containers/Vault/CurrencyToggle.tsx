import { useTranslation } from 'react-i18next'
import { useTooltip } from '../shared/components/Tooltip'
import './styles.scss'

export type DisplayCurrency = 'xrp' | 'usd'

interface Props {
  nativeCurrency: string // e.g., "XRP" or "RLUSD"
  selected: DisplayCurrency
  onToggle: (currency: DisplayCurrency) => void
}

export const CurrencyToggle = ({
  nativeCurrency,
  selected,
  onToggle,
}: Props) => {
  const { t } = useTranslation()
  const { showTooltip, hideTooltip } = useTooltip()

  return (
    <div className="currency-toggle">
      <button
        type="button"
        className={`toggle-option ${selected === 'xrp' ? 'active' : ''}`}
        onClick={() => onToggle('xrp')}
      >
        {nativeCurrency}
      </button>
      <button
        type="button"
        className={`toggle-option ${selected === 'usd' ? 'active' : ''}`}
        onClick={() => onToggle('usd')}
      >
        USD
      </button>
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
