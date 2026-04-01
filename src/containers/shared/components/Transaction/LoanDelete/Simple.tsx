import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { LoanDelete } from './types'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<LoanDelete>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { LoanID } = data.instructions

  return (
    <SimpleRow label={t('loan_id')} data-testid="loan-id">
      {LoanID}
    </SimpleRow>
  )
}
