import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { LoanDelete } from './types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<LoanDelete>) => {
  const { t } = useTranslation()
  const { LoanID } = instructions

  return (
    <div className="loan-delete">
      <span className="label">{t('deletes')}</span>
      <span>{t('loan_id')}</span>
      <span className="case-sensitive">
        <b>{LoanID}</b>
      </span>
    </div>
  )
}
