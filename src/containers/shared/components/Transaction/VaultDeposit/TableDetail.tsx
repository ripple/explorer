import { t } from 'i18next'
import type { VaultDeposit } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { Amount } from '../../Amount'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<VaultDeposit>) => {
  const { VaultID: vaultId, Amount: amount } = instructions
  return (
    <div className="vault-deposit">
      <span className="label">{t('send')}</span>
      <Amount value={formatAmount(amount)} />
      <span>{`${t('to')} ${t('vault_id')}`}</span>
      <b>{vaultId}</b>
    </div>
  )
}
