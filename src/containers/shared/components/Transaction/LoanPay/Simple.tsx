import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { LoanPay } from './types'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<LoanPay>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { LoanID, Amount: amount } = data.instructions

  return (
    <>
      <SimpleRow label={t('loan_id')} data-testid="loan-id">
        {LoanID}
      </SimpleRow>
      <SimpleRow label={t('amount')} data-testid="amount">
        <Amount value={formatAmount(amount)} />
      </SimpleRow>
    </>
  )
}
