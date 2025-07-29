import { Trans } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'
import { VaultDeposit } from './types'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Description = ({
  data,
}: TransactionDescriptionProps<VaultDeposit>) => {
  const { tx } = data
  const { Account: account, VaultID: vaultId, Amount: amount } = tx
  return (
    <Trans
      i18nKey="account_deposits_into_vault"
      components={{
        Account: <Account account={account} />,
        Amount: <Amount value={formatAmount(amount)} />,
        VaultID: <span>{vaultId}</span>,
      }}
    />
  )
}
