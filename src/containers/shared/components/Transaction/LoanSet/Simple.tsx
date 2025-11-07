import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import {
  isValidJsonString,
  durationToAccurateHuman,
  ONE_TENTH_BASIS_POINT,
} from '../../../utils'
import { JsonView } from '../../JsonView'
import { LoanSet } from './types'
import { convertHexToString } from '../../../../../rippled/lib/utils'
import { parsePercent } from '../../../NumberFormattingUtils'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<LoanSet>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const {
    LoanBrokerID,
    Counterparty,
    LoanOriginationFee,
    LoanServiceFee,
    LatePaymentFee,
    ClosePaymentFee,
    OverpaymentFee,
    InterestRate,
    LateInterestRate,
    CloseInterestRate,
    OverpaymentInterestRate,
    PrincipalRequested,
    PaymentTotal,
    PaymentInterval,
    GracePeriod,
    Data,
  } = data.instructions

  const dataFromHex = convertHexToString(Data)

  return (
    <>
      <SimpleRow label={t('loan_broker_id')} data-testid="loan-broker-id">
        {LoanBrokerID}
      </SimpleRow>
      {Counterparty && (
        <SimpleRow label={t('counterparty')} data-testid="counterparty">
          <Account account={Counterparty} />
        </SimpleRow>
      )}
      <SimpleRow
        label={t('principal_requested')}
        data-testid="principal-requested"
      >
        <Amount value={formatAmount(PrincipalRequested)} />
      </SimpleRow>
      {InterestRate !== undefined && (
        <SimpleRow label={t('interest_rate')} data-testid="interest-rate">
          {parsePercent(InterestRate / ONE_TENTH_BASIS_POINT)}
        </SimpleRow>
      )}
      {PaymentTotal !== undefined && (
        <SimpleRow label={t('payment_total')} data-testid="payment-total">
          {PaymentTotal}
        </SimpleRow>
      )}
      {PaymentInterval !== undefined && (
        <SimpleRow label={t('payment_interval')} data-testid="payment-interval">
          {durationToAccurateHuman(PaymentInterval)}
        </SimpleRow>
      )}
      {GracePeriod !== undefined && (
        <SimpleRow label={t('grace_period')} data-testid="grace-period">
          {durationToAccurateHuman(GracePeriod)}
        </SimpleRow>
      )}
      {LoanOriginationFee !== undefined && (
        <SimpleRow
          label={t('loan_origination_fee')}
          data-testid="loan-origination-fee"
        >
          <Amount value={formatAmount(LoanOriginationFee)} />
        </SimpleRow>
      )}
      {LoanServiceFee !== undefined && (
        <SimpleRow label={t('loan_service_fee')} data-testid="loan-service-fee">
          <Amount value={formatAmount(LoanServiceFee)} />
        </SimpleRow>
      )}
      {LatePaymentFee !== undefined && (
        <SimpleRow label={t('late_payment_fee')} data-testid="late-payment-fee">
          <Amount value={formatAmount(LatePaymentFee)} />
        </SimpleRow>
      )}
      {ClosePaymentFee !== undefined && (
        <SimpleRow
          label={t('close_payment_fee')}
          data-testid="close-payment-fee"
        >
          <Amount value={formatAmount(ClosePaymentFee)} />
        </SimpleRow>
      )}
      {OverpaymentFee !== undefined && (
        <SimpleRow label={t('overpayment_fee')} data-testid="overpayment-fee">
          {parsePercent(OverpaymentFee / ONE_TENTH_BASIS_POINT)}
        </SimpleRow>
      )}
      {LateInterestRate !== undefined && (
        <SimpleRow
          label={t('late_interest_rate')}
          data-testid="late-interest-rate"
        >
          {parsePercent(LateInterestRate / ONE_TENTH_BASIS_POINT)}
        </SimpleRow>
      )}
      {CloseInterestRate !== undefined && (
        <SimpleRow
          label={t('close_interest_rate')}
          data-testid="close-interest-rate"
        >
          {parsePercent(CloseInterestRate / ONE_TENTH_BASIS_POINT)}
        </SimpleRow>
      )}
      {OverpaymentInterestRate !== undefined && (
        <SimpleRow
          label={t('overpayment_interest_rate')}
          data-testid="overpayment-interest-rate"
        >
          {parsePercent(OverpaymentInterestRate / ONE_TENTH_BASIS_POINT)}
        </SimpleRow>
      )}
      {dataFromHex && (
        <SimpleRow label={t('data')} className="dt" data-testid="data">
          {isValidJsonString(dataFromHex) ? (
            <JsonView data={JSON.parse(dataFromHex)} />
          ) : (
            dataFromHex
          )}
        </SimpleRow>
      )}
    </>
  )
}
