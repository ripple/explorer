import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { LoanBrokerCoverClawback } from './types'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<LoanBrokerCoverClawback>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { LoanBrokerID, Amount: amount } = data.instructions

  return (
    <>
      {LoanBrokerID && (
        <SimpleRow label={t('loan_broker_id')} data-testid="loan-broker-id">
          {LoanBrokerID}
        </SimpleRow>
      )}
      {amount !== undefined && (
        <SimpleRow label={t('amount')} data-testid="amount">
          <Amount value={formatAmount(amount)} />
        </SimpleRow>
      )}
    </>
  )
}
