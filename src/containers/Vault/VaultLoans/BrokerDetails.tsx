import { useTranslation } from 'react-i18next'
import { CopyableText } from '../../shared/components/CopyableText/CopyableText'
import { useLanguage } from '../../shared/hooks'
import { localizeNumber } from '../../shared/utils'
import { decodeBrokerName, formatRate } from './utils'

interface LoanBrokerData {
  index: string
  Data?: string
  ManagementFeeRate?: number
  CoverAvailable?: string
  CoverRateMinimum?: number
  CoverRateLiquidation?: number
}

interface Props {
  broker: LoanBrokerData
}

export const BrokerDetails = ({ broker }: Props) => {
  const { t } = useTranslation()
  const language = useLanguage()

  const brokerName = decodeBrokerName(broker.Data, 0)

  const formatCoverAvailable = (amount: string | undefined): string => {
    // the default value for CoverAvailable is 0
    if (!amount)
      return localizeNumber(0, language)
    const num = Number(amount)
    if (Number.isNaN(num)) return amount
    return localizeNumber(num, language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <div className="broker-details-card">
      <div className="broker-header">
        <span className="broker-label">{t('loan_broker')}</span>
        <h3 className="broker-name">{brokerName}</h3>
      </div>

      <div className="broker-id-row">
        <span className="broker-id-label">{t('loan_broker_id')}</span>
        <div className="broker-id-value">
          <CopyableText text={broker.index} displayText={broker.index} />
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
    </div>
  )
}
