import { t } from 'i18next'
import { Trans } from 'react-i18next'
import type { VaultClawback } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { Amount } from '../../Amount'
import { Account } from '../../Account'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<VaultClawback>) => {
  const { Holder: holder, Amount: amount } = instructions
  return (
    <div className="vault-clawback">
      <Trans i18nKey="action_from">
        <span className="label">{t('claws_back')}</span>
        {amount && <Amount value={formatAmount(amount)} />}
        {t('from')}
        <Account account={holder} />
      </Trans>
    </div>
  )
}
