import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { formatDurationDetailed } from '../../../utils'
import { JsonView } from '../../JsonView'
import SocketContext from '../../../SocketContext'
import { getVaultAssetFromLoanBroker } from '../utils/vaultUtils'
import { formatAmountWithAsset } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)

  const {
    loanBrokerID,
    counterparty,
    principalRequestedRaw,
    loanOriginationFeeRaw,
    loanServiceFeeRaw,
    latePaymentFeeRaw,
    closePaymentFeeRaw,
    paymentTotal,
    paymentInterval,
    gracePeriod,
    dataFromHex,
    dataAsJson,
    interestRatePercent,
    lateInterestRatePercent,
    closeInterestRatePercent,
    overpaymentInterestRatePercent,
    overpaymentFeePercent,
  } = data.instructions

  // Fetch Vault asset information from LoanBroker
  const { data: vaultAsset } = useQuery(
    ['vaultAssetFromLoanBroker', loanBrokerID],
    () => getVaultAssetFromLoanBroker(rippledSocket, loanBrokerID),
    { enabled: !!loanBrokerID && !!rippledSocket },
  )

  // Format amounts with correct currency
  const principalRequested =
    vaultAsset && principalRequestedRaw !== undefined
      ? formatAmountWithAsset(principalRequestedRaw, vaultAsset)
      : undefined

  const loanOriginationFee =
    vaultAsset && loanOriginationFeeRaw !== undefined
      ? formatAmountWithAsset(loanOriginationFeeRaw, vaultAsset)
      : undefined

  const loanServiceFee =
    vaultAsset && loanServiceFeeRaw !== undefined
      ? formatAmountWithAsset(loanServiceFeeRaw, vaultAsset)
      : undefined

  const latePaymentFee =
    vaultAsset && latePaymentFeeRaw !== undefined
      ? formatAmountWithAsset(latePaymentFeeRaw, vaultAsset)
      : undefined

  const closePaymentFee =
    vaultAsset && closePaymentFeeRaw !== undefined
      ? formatAmountWithAsset(closePaymentFeeRaw, vaultAsset)
      : undefined

  return (
    <>
      <SimpleRow label={t('loan_broker_id')} data-testid="loan-broker-id">
        {loanBrokerID}
      </SimpleRow>
      {counterparty && (
        <SimpleRow label={t('counterparty')} data-testid="counterparty">
          <Account account={counterparty} />
        </SimpleRow>
      )}
      {principalRequested && (
        <SimpleRow
          label={t('principal_requested')}
          data-testid="principal-requested"
        >
          <Amount value={principalRequested} />
        </SimpleRow>
      )}
      {interestRatePercent && (
        <SimpleRow label={t('interest_rate')} data-testid="interest-rate">
          {interestRatePercent}
        </SimpleRow>
      )}
      {paymentTotal !== undefined && (
        <SimpleRow label={t('payment_total')} data-testid="payment-total">
          {paymentTotal}
        </SimpleRow>
      )}
      {paymentInterval !== undefined && (
        <SimpleRow label={t('payment_interval')} data-testid="payment-interval">
          {formatDurationDetailed(paymentInterval)}
        </SimpleRow>
      )}
      {gracePeriod !== undefined && (
        <SimpleRow label={t('grace_period')} data-testid="grace-period">
          {formatDurationDetailed(gracePeriod)}
        </SimpleRow>
      )}
      {loanOriginationFee && (
        <SimpleRow
          label={t('loan_origination_fee')}
          data-testid="loan-origination-fee"
        >
          <Amount value={loanOriginationFee} />
        </SimpleRow>
      )}
      {loanServiceFee && (
        <SimpleRow label={t('loan_service_fee')} data-testid="loan-service-fee">
          <Amount value={loanServiceFee} />
        </SimpleRow>
      )}
      {latePaymentFee && (
        <SimpleRow label={t('late_payment_fee')} data-testid="late-payment-fee">
          <Amount value={latePaymentFee} />
        </SimpleRow>
      )}
      {closePaymentFee && (
        <SimpleRow
          label={t('close_payment_fee')}
          data-testid="close-payment-fee"
        >
          <Amount value={closePaymentFee} />
        </SimpleRow>
      )}
      {overpaymentFeePercent && (
        <SimpleRow label={t('overpayment_fee')} data-testid="overpayment-fee">
          {overpaymentFeePercent}
        </SimpleRow>
      )}
      {lateInterestRatePercent && (
        <SimpleRow
          label={t('late_interest_rate')}
          data-testid="late-interest-rate"
        >
          {lateInterestRatePercent}
        </SimpleRow>
      )}
      {closeInterestRatePercent && (
        <SimpleRow
          label={t('close_interest_rate')}
          data-testid="close-interest-rate"
        >
          {closeInterestRatePercent}
        </SimpleRow>
      )}
      {overpaymentInterestRatePercent && (
        <SimpleRow
          label={t('overpayment_interest_rate')}
          data-testid="overpayment-interest-rate"
        >
          {overpaymentInterestRatePercent}
        </SimpleRow>
      )}
      {dataFromHex && (
        <SimpleRow label={t('data')} className="dt" data-testid="data">
          {dataAsJson ? <JsonView data={dataAsJson} /> : dataFromHex}
        </SimpleRow>
      )}
    </>
  )
}
