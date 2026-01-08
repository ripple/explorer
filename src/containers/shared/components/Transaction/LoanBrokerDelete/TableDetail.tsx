import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { LoanBrokerDelete } from './types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<LoanBrokerDelete>) => {
  const { t } = useTranslation()
  const { LoanBrokerID } = instructions

  return (
    <div className="loan-broker-delete">
      <span className="label">{t('delete')}</span>
      <span>{t('loan_broker_id')}</span>
      <span className="case-sensitive">
        <b>{LoanBrokerID}</b>
      </span>
    </div>
  )
}
