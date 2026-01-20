import { useTranslation } from 'react-i18next'
import { CopyableText } from '../../shared/components/CopyableText/CopyableText'
import { useLanguage } from '../../shared/hooks'
import { localizeNumber } from '../../shared/utils'
import { formatRate } from './utils'
import { BrokerLoansTable } from './BrokerLoansTable'

interface LoanBrokerData {
  index: string
  Account: string
  Data?: string
  ManagementFeeRate?: number
  CoverAvailable?: string
  CoverRateMinimum?: number
  CoverRateLiquidation?: number
  DebtTotal?: string
  DebtMaximum?: string
}

interface Props {
  broker: LoanBrokerData
  currency?: string
}

export const BrokerDetails = ({ broker, currency }: Props) => {
  const { t } = useTranslation()
  const language = useLanguage()

  const lang = language ?? 'en-US'

  /**
   * Format large numbers with K (thousands) or M (millions) suffixes
   */
  const formatCompactAmount = (amount: string | undefined, includeCurrency = true): string => {
    if (!amount) return includeCurrency ? `0 ${currency}` : '0'
    const num = Number(amount)
    if (Number.isNaN(num)) return amount

    let formattedNum: string
    if (num >= 1_000_000) {
      const millions = num / 1_000_000
      formattedNum = `${localizeNumber(millions, lang, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}M`
    } else if (num >= 1_000) {
      const thousands = num / 1_000
      formattedNum = `${localizeNumber(thousands, lang, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}K`
    } else {
      formattedNum = String(localizeNumber(num, lang, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }))
    }

    return includeCurrency ? `${formattedNum} ${currency}` : formattedNum
  }

  return (
    <div className="broker-details-card">
      <div className="broker-top-row">
        <div className="broker-id-section">
          <span className="broker-id-label">{t('loan_broker_id')}</span>
          <div className="broker-id-value">
            <CopyableText text={broker.index} displayText={broker.index} showCopyIcon />
          </div>
        </div>
        <div className="broker-debt-section">
          <div className="debt-metric">
            <span className="metric-label">{t('total_debt')}</span>
            <span className="metric-value">{formatCompactAmount(broker.DebtTotal)}</span>
          </div>
          <div className="debt-metric">
            <span className="metric-label">{t('maximum_debt')}</span>
            <span className="metric-value">{formatCompactAmount(broker.DebtMaximum)}</span>
          </div>
        </div>
      </div>

      <div className="broker-metrics">
        <div className="metric">
          <span className="metric-label">{t('management_fee')}</span>
          <span className="metric-value">
            {formatRate(broker.ManagementFeeRate)}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">{t('first_loss_capital')}</span>
          <span className="metric-value">
            {formatCompactAmount(broker.CoverAvailable)}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">{t('cover_rate_minimum')}</span>
          <span className="metric-value">
            {formatRate(broker.CoverRateMinimum)}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">{t('cover_rate_liquidation')}</span>
          <span className="metric-value">
            {formatRate(broker.CoverRateLiquidation)}
          </span>
        </div>
      </div>

      <BrokerLoansTable
        brokerAccount={broker.Account}
        loanBrokerId={broker.index}
        currency={currency}
      />
    </div>
  )
}
