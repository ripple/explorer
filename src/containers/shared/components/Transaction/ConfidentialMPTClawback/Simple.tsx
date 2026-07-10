import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { Account } from '../../Account'
import { Amount } from '../../Amount'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { amount, holder } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      <SimpleRow label={t('holder')} data-testid="holder">
        <Account account={holder} />
      </SimpleRow>
      <SimpleRow label={t('clawback')} data-testid="clawback">
        <Amount value={amount} />
      </SimpleRow>
    </>
  )
}
