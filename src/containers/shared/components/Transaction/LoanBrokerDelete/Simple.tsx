import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { LoanBrokerDelete } from './types'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<LoanBrokerDelete>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { LoanBrokerID } = data.instructions

  return (
    <SimpleRow label={t('loan_broker_id')} data-testid="loan-broker-id">
      {LoanBrokerID}
    </SimpleRow>
  )
}
