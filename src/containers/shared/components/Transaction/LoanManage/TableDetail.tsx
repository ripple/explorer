import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { LoanManage } from './types'
import { shortenLoanID } from '../../../utils'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<LoanManage>) => {
  const { t } = useTranslation()
  const { LoanID } = instructions

  return (
    <div className="loan-manage">
      <span>{t('loan_id')}</span>
      <span className="case-sensitive">
        <b>{shortenLoanID(LoanID)}</b>
      </span>
    </div>
  )
}
