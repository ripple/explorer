import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { ClawbackInstructions } from './types'
import { Account } from '../../Account'
import { Amount } from '../../Amount'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<ClawbackInstructions>) => {
  const { amount, holder } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      <SimpleRow label={t('holder')} data-test="holder">
        <Account account={holder} />
      </SimpleRow>
      {amount && (
        <SimpleRow label={t('amount')} data-test="amount">
          <Amount value={amount} displayIssuer />
        </SimpleRow>
      )}
    </>
  )
}
