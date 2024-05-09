import { useTranslation } from 'react-i18next'
import type { TrustSet } from 'xrpl'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Simple = ({ data }: TransactionSimpleProps<TrustSet>) => {
  const { t } = useTranslation()
  const { LimitAmount } = data.instructions

  return (
    <SimpleRow label={t('set_limit')} data-testid="limit-amount">
      <Amount value={formatAmount(LimitAmount)} />
    </SimpleRow>
  )
}
