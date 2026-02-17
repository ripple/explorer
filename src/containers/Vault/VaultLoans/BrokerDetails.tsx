import { useTranslation } from 'react-i18next'
import { CopyableText } from '../../shared/components/CopyableText/CopyableText'
import { useTokenToUSDRate } from '../../shared/hooks/useTokenToUSDRate'
import { formatRate, LSF_LOAN_DEFAULT } from './utils'
import { BrokerLoansTable } from './BrokerLoansTable'
import WarningIcon from '../../shared/images/warning.svg'
import { parseAmount } from '../../shared/NumberFormattingUtils'
import {
  shortenLoanBrokerID,
  shortenMPTID,
  getCurrencySymbol,
} from '../../shared/utils'

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

interface AssetInfo {
  currency: string
  issuer?: string
  mpt_issuance_id?: string
}

interface Props {
  broker: LoanBrokerData
  displayCurrency: string
  asset?: AssetInfo
  loans?: any[]
}

export const BrokerDetails = ({
  broker,
  displayCurrency,
  asset,
  loans,
}: Props) => {
  const { t } = useTranslation()
  const { rate: tokenToUsdRate } = useTokenToUSDRate(asset)

  // Convert amount to display currency (USD or native)
  const convertToDisplayCurrency = (
    amount: string | undefined,
  ): string | undefined => {
    if (!amount || displayCurrency !== 'USD') return amount
    const numAmount = Number(amount)
    if (Number.isNaN(numAmount)) return amount
    return tokenToUsdRate > 0 ? String(numAmount * tokenToUsdRate) : undefined
  }

  // Check if any loan has the default flag
  const hasDefaultedLoan = loans?.some(
    // eslint-disable-next-line no-bitwise -- required to check the status of the loan
    (loan: any) =>
      loan.TotalValueOutstanding > 0 && (loan.Flags ?? 0) & LSF_LOAN_DEFAULT,
  )

  const formatBrokerAmount = (amount: string | undefined): string => {
    const convertedAmount = convertToDisplayCurrency(amount)
    if (convertedAmount === undefined && displayCurrency === 'usd') {
      return '--'
    }

    if (convertedAmount !== undefined)
      return `${parseAmount(convertedAmount, 2)}`
    if (amount !== undefined) return `${parseAmount(amount, 2)}`
    return '--'
  }

  return (
    <div className="broker-details-card">
      <div className="broker-top-row">
        <div className="broker-id-section">
          <span className="broker-id-label">{t('loan_broker_id')}</span>
          <div className="broker-id-value">
            <CopyableText
              text={broker.index}
              displayText={shortenLoanBrokerID(broker.index)}
              showCopyIcon
            />
          </div>
        </div>
        <div className="broker-debt-section">
          <div className="debt-metric">
            <span className="metric-label">{t('total_debt')}</span>
            <span className="metric-value">
              {formatBrokerAmount(broker.DebtTotal)}{' '}
              {getCurrencySymbol(asset?.currency) ??
                `MPT (${shortenMPTID(asset?.mpt_issuance_id)})`}
            </span>
          </div>
          <div className="debt-metric">
            <span className="metric-label">{t('maximum_debt')}</span>
            <span className="metric-value">
              {formatBrokerAmount(broker.DebtMaximum)}{' '}
              {getCurrencySymbol(asset?.currency) ??
                `MPT (${shortenMPTID(asset?.mpt_issuance_id)})`}
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
            {formatBrokerAmount(broker.CoverAvailable)}{' '}
            {getCurrencySymbol(asset?.currency) ??
              `MPT (${shortenMPTID(asset?.mpt_issuance_id)})`}
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
        loans={loans}
        currency={
          getCurrencySymbol(asset?.currency) ??
          shortenMPTID(asset?.mpt_issuance_id)
        }
        displayCurrency={displayCurrency}
        asset={asset}
      />

      {hasDefaultedLoan && (
        <div className="broker-default-banner">
          <WarningIcon className="warning-icon" />
          <span>{t('loan_default_detected')}</span>
        </div>
      )}
    </div>
  )
}
