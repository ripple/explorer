import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { durationToAccurateHuman } from '../../../utils'
import { JsonView } from '../../JsonView'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const {
    loanBrokerID,
    counterparty,
    principalRequested,
    loanOriginationFee,
    loanServiceFee,
    latePaymentFee,
    closePaymentFee,
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
      <SimpleRow
        label={t('principal_requested')}
        data-testid="principal-requested"
      >
        <Amount value={principalRequested} />
      </SimpleRow>
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
          {durationToAccurateHuman(paymentInterval)}
        </SimpleRow>
      )}
      {gracePeriod !== undefined && (
        <SimpleRow label={t('grace_period')} data-testid="grace-period">
          {durationToAccurateHuman(gracePeriod)}
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
