import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { LoanBrokerCoverWithdraw } from './types'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<LoanBrokerCoverWithdraw>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { LoanBrokerID, Amount: amount, Destination } = data.instructions

  return (
    <>
      <SimpleRow label={t('loan_broker_id')} data-testid="loan-broker-id">
        {LoanBrokerID}
      </SimpleRow>
      <SimpleRow label={t('amount')} data-testid="amount">
        <Amount value={formatAmount(amount)} />
      </SimpleRow>
      {Destination && (
        <SimpleRow label={t('destination')} data-testid="destination">
          <Account account={Destination} />
        </SimpleRow>
      )}
    </>
  )
}
