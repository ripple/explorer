import { Trans } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'
import { VaultDelete } from './types'
import { Account } from '../../Account'

export const Description = ({
  data,
}: TransactionDescriptionProps<VaultDelete>) => {
  const { tx } = data
  const { Account: account, VaultID: vaultId } = tx
  return (
    <Trans
      i18nKey="account_deletes_vault"
      components={{
        Account: <Account account={account} />,
        VaultID: <b>{vaultId}</b>,
      }}
    />
  )
}
