import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Account } from '../../shared/components/Account'
import SocketContext from '../../shared/SocketContext'
import { useLanguage } from '../../shared/hooks'
import { useTokenToUSDRate } from '../../shared/hooks/useTokenToUSDRate'
import { parseAmount } from '../../shared/NumberFormattingUtils'
import { getLedgerEntry } from '../../../rippled/lib/rippled'
import {
  formatRate,
  formatPaymentInterval,
  formatLoanStatus,
  formatRippleDate,
  truncateId,
} from './utils'
import ExpandIcon from '../../shared/images/down_arrow.svg'
import { getCurrencySymbol } from '../../shared/utils'

export interface LoanData {
  index: string
  Borrower: string
  LoanBrokerID: string
  TotalValueOutstanding: string
  InterestRate: number
  LateInterestRate: number
  CloseInterestRate: number
  LoanOriginationFee: string
  LoanServiceFee: string
  LatePaymentFee: string
  ClosePaymentFee: string
  OverpaymentFee: number
  PaymentInterval: number
  PaymentRemaining: number
  GracePeriod: number
  StartDate: number
  NextPaymentDueDate: number
  Flags: number
  PaymentTotal?: number
  PreviousTxnLgrSeq?: number
  PrincipalOutstanding?: string
}

interface AssetInfo {
  currency: string
  issuer?: string
  mpt_issuance_id?: string
}

interface Props {
  loan: LoanData
  currency: string
  displayCurrency: string
  asset?: AssetInfo
  isCurrencySpecialSymbol?: boolean
}

export const LoanRow = ({
  loan,
  currency,
  displayCurrency,
  asset,
  isCurrencySpecialSymbol = false,
}: Props) => {
  const { t } = useTranslation()
  const language = useLanguage()
  const rippledSocket = useContext(SocketContext)
  const { rate: tokenToUsdRate } = useTokenToUSDRate(asset)
  const [expanded, setExpanded] = useState(false)

  const { data: originalPrincipal, isLoading: isPrincipalLoading } = useQuery(
    ['originalPrincipal', loan.index],
    async () => {
      if (!loan.PreviousTxnLgrSeq) return loan.PrincipalOutstanding ?? null

      let lastSuccessful: any = null
      let currentSeq = loan.PreviousTxnLgrSeq
      const MAX_ITERATIONS = 100

      for (let i = 0; i < MAX_ITERATIONS; i += 1) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const resp = await getLedgerEntry(
            rippledSocket,
            { index: loan.index },
            currentSeq - 1,
          )
          lastSuccessful = resp.node
          if (currentSeq === resp.node.PreviousTxnLgrSeq) break
          currentSeq = resp.node.PreviousTxnLgrSeq
        } catch {
          // entryNotFound means we've gone past creation — last success is the creation state
          break
        }
      }

      return (
        lastSuccessful?.PrincipalOutstanding ??
        loan.PrincipalOutstanding ??
        null
      )
    },
    {
      staleTime: Infinity,
      enabled: !!rippledSocket,
    },
  )

  const { status, colorClass } = formatLoanStatus(
    loan.Flags,
    loan.TotalValueOutstanding ?? 0,
  )

  const formatAmount = (amount: string | number): string => {
    const num = typeof amount === 'string' ? Number(amount) : amount
    if (Number.isNaN(num)) return String(amount)

    // Convert to USD if needed
    let displayNum = num
    if (displayCurrency === 'USD' && tokenToUsdRate > 0) {
      displayNum = num * tokenToUsdRate
    } else if (displayCurrency === 'USD' && tokenToUsdRate === 0) {
      return '--'
    }

    const prefix = displayCurrency === 'USD' ? '$' : ''
    if (isCurrencySpecialSymbol && displayCurrency !== 'USD')
      return `${getCurrencySymbol(currency)} ${parseAmount(displayNum, 1, language)}`
    return `${prefix}${parseAmount(displayNum, 1, language)} ${displayCurrency}`
  }

  const formatFee = (fee: string | number): string => {
    // this method is used with fields which have a soeDEFAULT configuration. If they are not specified, display 0.
    if (!fee) return '0'
    const num = typeof fee === 'string' ? Number(fee) : fee
    if (Number.isNaN(num)) return String(fee)
    if (num === 0) return '0'

    // Convert to USD if needed
    let displayNum = num
    if (displayCurrency === 'USD' && tokenToUsdRate > 0) {
      displayNum = num * tokenToUsdRate
    } else if (displayCurrency === 'USD' && tokenToUsdRate === 0) {
      return '--'
    }

    const prefix = displayCurrency === 'USD' ? '$' : ''
    if (isCurrencySpecialSymbol)
      return `${getCurrencySymbol(currency)} ${parseAmount(displayNum, 1, language)}`
    return `${prefix}${parseAmount(displayNum, 1, language)} ${displayCurrency}`
  }

  const formatGracePeriod = (seconds: number): string => {
    const days = Math.round(seconds / 86400)
    return `${days} Days`
  }

  return (
    <div className={`loan-row ${expanded ? 'expanded' : ''}`}>
      <button
        type="button"
        className="loan-row-main"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="loan-cell loan-id">
          <ExpandIcon className={`expand-icon ${expanded ? 'rotated' : ''}`} />
          <span className="loan-id-text">{truncateId(loan.index)}</span>
        </div>
        <div className="loan-cell borrower">
          <Account
            account={loan.Borrower}
            displayText={truncateId(loan.Borrower, 7, 4)}
          />
        </div>
        <div className="loan-cell amount-requested">
          {isPrincipalLoading
            ? '--'
            : formatAmount(originalPrincipal ?? loan.PrincipalOutstanding ?? 0)}
        </div>
        <div className="loan-cell interest-rate">
          {formatRate(loan.InterestRate)}
        </div>
        <div className="loan-cell outstanding-balance">
          {formatAmount(loan.TotalValueOutstanding ?? 0)}
        </div>
        <div className={`loan-cell status ${colorClass}`}>
          <span className="status-dot" />
          {t(status)}
        </div>
      </button>

      {expanded && (
        <div className="loan-row-details">
          <div className="details-row">
            <div className="detail-item">
              <span className="detail-label">{t('next_due_date')}</span>
              <span className="detail-value">
                {formatRippleDate(loan.NextPaymentDueDate, language)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t('origination_date')}</span>
              <span className="detail-value">
                {formatRippleDate(loan.StartDate, language)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t('frequency')}</span>
              <span className="detail-value">
                {formatPaymentInterval(loan.PaymentInterval)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t('installments')}</span>
              <span className="detail-value">{loan.PaymentRemaining}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t('grace_period')}</span>
              <span className="detail-value">
                {formatGracePeriod(loan.GracePeriod)}
              </span>
            </div>
          </div>
          <div className="details-row">
            <div className="detail-item">
              <span className="detail-label">{t('loan_origination_fee')}</span>
              <span className="detail-value">
                {formatFee(loan.LoanOriginationFee)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t('loan_service_fee')}</span>
              <span className="detail-value">
                {formatFee(loan.LoanServiceFee)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t('late_interest_rate')}</span>
              <span className="detail-value">
                {formatRate(loan.LateInterestRate)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t('late_payment_fee')}</span>
              <span className="detail-value">
                {formatFee(loan.LatePaymentFee)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t('prepayment_fee')}</span>
              <span className="detail-value">
                {formatFee(loan.OverpaymentFee)}
              </span>
            </div>
          </div>
          <div className="details-row">
            <div className="detail-item">
              <span className="detail-label">{t('full_payment_fee')}</span>
              <span className="detail-value">
                {formatFee(loan.ClosePaymentFee)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
