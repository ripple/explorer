import { useTranslation } from 'react-i18next'
import { TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Account } from '../../Account'
import { Amount } from '../../Amount'

export const Simple = ({ data }: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { amount2, amount, holder } = data.instructions
  return (
    <>
      <SimpleRow label={t('holder')} data-testid="holder">
        <Account account={holder} />
      </SimpleRow>
      {amount && (
        <SimpleRow label={t('asset1')} data-testid="asset1">
          <Amount value={amount} displayIssuer />
        </SimpleRow>
      )}
      {amount2 && (
        <SimpleRow label={t('asset2')} data-testid="asset2">
          <Amount value={amount2} displayIssuer />
        </SimpleRow>
      )}
    </>
  )
}
