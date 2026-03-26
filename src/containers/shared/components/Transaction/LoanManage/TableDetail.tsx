import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { LoanManage } from './types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<LoanManage>) => {
  const { t } = useTranslation()
  const { LoanID } = instructions

  return (
    <div className="loan-manage">
      <span>{t('loan_id')}</span>
      <span className="case-sensitive">
        <b>{LoanID}</b>
      </span>
    </div>
  )
}
