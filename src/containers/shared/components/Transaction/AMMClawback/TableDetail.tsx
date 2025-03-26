import { Trans, useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { TransactionTableDetailProps } from '../types'

export const TableDetail = ({ instructions }: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const { amount2, amount, holder } = instructions
  if (amount2) {
    return (
      <div className="amm-clawback">
        <Trans i18nKey="action_from_and">
          <span className="label">{t('claws_back')}</span>
          <Amount value={amount} displayIssuer />
          and
          <Amount value={amount2} displayIssuer />
          from
          <Account account={holder} />
        </Trans>
      </div>
    )
  }
  return (
    <div className="amm-clawback">
      <Trans i18nKey="action_from">
        <span className="label">{t('claws_back')}</span>
        <Amount value={amount} displayIssuer />
        from
        <Account account={holder} />
      </Trans>
    </div>
  )
}
