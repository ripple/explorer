import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { CopyableText } from '../../shared/components/CopyableText/CopyableText'
import { useLanguage } from '../../shared/hooks'
import SocketContext from '../../shared/SocketContext'
import { getAccountObjects } from '../../../rippled/lib/rippled'
import { useAnalytics } from '../../shared/analytics'
import { Loader } from '../../shared/components/Loader'
import { formatRate, LSF_LOAN_DEFAULT } from './utils'
import { formatCompactNumber } from '../utils'
import { BrokerLoansTable } from './BrokerLoansTable'
import WarningIcon from '../../shared/images/warning.svg'

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
  const rippledSocket = useContext(SocketContext)
  const { trackException } = useAnalytics()

  const lang = language ?? 'en-US'

  // Fetch loans for this broker (used for both table display and default check)
  const { data: loans, isFetching: loansLoading } = useQuery(
    ['getBrokerLoans', broker.Account, broker.index],
    async () => {
      const resp = await getAccountObjects(
        rippledSocket,
        broker.Account,
        'loan',
      )
      return resp?.account_objects?.filter(
        (obj: any) => obj.LoanBrokerID === broker.index,
      )
    },
    {
      enabled: !!broker.Account && !!broker.index,
      onError: (e: any) => {
        trackException(`BrokerLoans ${broker.Account} --- ${JSON.stringify(e)}`)
      },
    },
  )

  // Check if any loan has the default flag
  const hasDefaultedLoan = loans?.some(
    // eslint-disable-next-line no-bitwise
    (loan: any) => (loan.Flags ?? 0) & LSF_LOAN_DEFAULT,
  )

  const formatAmount = (amount: string | undefined): string =>
    formatCompactNumber(amount, lang, {
      currency,
      fallback: `0 ${currency || ''}`.trim(),
    })

  return (
    <div className="broker-details-card">
      <div className="broker-top-row">
        <div className="broker-id-section">
          <span className="broker-id-label">{t('loan_broker_id')}</span>
          <div className="broker-id-value">
            <CopyableText
              text={broker.index}
              displayText={broker.index}
              showCopyIcon
            />
          </div>
        </div>
        <div className="broker-debt-section">
          <div className="debt-metric">
            <span className="metric-label">{t('total_debt')}</span>
            <span className="metric-value">
              {formatAmount(broker.DebtTotal)}
            </span>
          </div>
          <div className="debt-metric">
            <span className="metric-label">{t('maximum_debt')}</span>
            <span className="metric-value">
              {formatAmount(broker.DebtMaximum)}
            </span>
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
            {formatAmount(broker.CoverAvailable)}
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

      {loansLoading ? (
        <div className="broker-loans-loading">
          <Loader />
        </div>
      ) : (
        <BrokerLoansTable loans={loans} currency={currency} />
      )}

      {hasDefaultedLoan && (
        <div className="broker-default-banner">
          <WarningIcon className="warning-icon" />
          <span>{t('loan_default_detected')}</span>
        </div>
      )}
    </div>
  )
}
