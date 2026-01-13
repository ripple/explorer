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
}

interface Props {
  broker: LoanBrokerData
  currency?: string
}

export const BrokerDetails = ({ broker, currency }: Props) => {
  const { t } = useTranslation()
  const language = useLanguage()

  const formatCoverAvailable = (amount: string | undefined): string => {
    const lang = language ?? 'en-US'
    // the default value for CoverAvailable is 0
    if (!amount) return localizeNumber(0, lang)
    const num = Number(amount)
    if (Number.isNaN(num)) return amount
    return localizeNumber(num, lang, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <div className="broker-details-card">
      <div className="broker-id-row">
        <span className="broker-id-label">{t('loan_broker_id')}</span>
        <div className="broker-id-value">
          <CopyableText text={broker.index} displayText={broker.index} showCopyIcon />
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
            {/* TODO: Investigate why one of the loan brokers display a cover of 15k -- there is a bug somewhere */}
            {formatCoverAvailable(broker.CoverAvailable)}
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
