import { useTranslation, Trans } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { Amount } from '../../Amount'
import { Account } from '../../Account'

export const TableDetail = ({ instructions }: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const { amount, holder } = instructions

  return (
    <div className="confidential-mpt-clawback">
      <Trans i18nKey="action_from">
        <span className="label">{t('claws_back')}</span>
        <Amount value={amount} />
        from
        <Account account={holder} />
      </Trans>
    </div>
  )
}
