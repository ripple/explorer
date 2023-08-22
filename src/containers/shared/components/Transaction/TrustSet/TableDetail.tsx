import { useTranslation } from 'react-i18next'
import type { TrustSet } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import { Amount } from '../../Amount'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<TrustSet>) => {
  const { t } = useTranslation()
  return (
    <div className="trustset">
      <span className="label">{t('set_limit')}</span>
      <Amount value={formatAmount(instructions.LimitAmount)} />
    </div>
  )
}
