import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { loanBrokerID, calculatedAmount } = data.instructions

  return (
    <>
      {loanBrokerID && (
        <SimpleRow label={t('loan_broker_id')} data-testid="loan-broker-id">
          {loanBrokerID}
        </SimpleRow>
      )}
      {calculatedAmount && (
        <SimpleRow label={t('amount')} data-testid="amount">
          <Amount value={calculatedAmount} />
        </SimpleRow>
      )}
    </>
  )
}
