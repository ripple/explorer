import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { LoanPay } from './types'
import { Amount } from '../../Amount'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<LoanPay>) => {
  const { t } = useTranslation()
  const { Amount: amount, LoanID } = instructions

  return (
    <div className="loan-pay">
      <span className="label">{t('send')}</span>
      <Amount value={formatAmount(amount)} />
      <span>
        {t('to')} {t('loan_id')}
      </span>
      <span className="case-sensitive">{LoanID}</span>
    </div>
  )
}
