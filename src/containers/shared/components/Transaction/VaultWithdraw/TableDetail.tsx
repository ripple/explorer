import { t } from 'i18next'
import type { VaultWithdraw } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { shortenVaultID } from '../../../utils'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<VaultWithdraw>) => {
  const {
    VaultID: vaultId,
    Amount: amount,
    Destination: destination,
  } = instructions
  return (
    <div className="vault-withdraw">
      <span className="label">{t('withdraws')}</span>
      <Amount value={formatAmount(amount)} />
      <span>{`${t('from')} ${t('vault_id')}`}</span>
      <b>{shortenVaultID(vaultId)}</b>
      {destination && (
        <>
          <span>${t('to')}</span> <Account account={destination} />
        </>
      )}
    </div>
  )
}
