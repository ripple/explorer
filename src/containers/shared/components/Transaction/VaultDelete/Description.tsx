import { Trans } from 'react-i18next'
import type { VaultDelete } from 'xrpl'
import { TransactionDescriptionProps } from '../types'
import { Account } from '../../Account'
import { decodeHex, hexMatch } from '../../../transactionUtils'

export const Description = ({
  data,
}: TransactionDescriptionProps<VaultDelete>) => {
  const { tx } = data
  const { Account: account, VaultID: vaultId } = tx
  // MemoData is not yet part of the xrpl package's VaultDelete type
  const memoData = (tx as any).MemoData as string | undefined
  return (
    <>
      <Trans
        i18nKey="account_deletes_vault"
        components={{
          Account: <Account account={account} />,
          VaultID: <b>{vaultId}</b>,
        }}
      />
      {memoData && hexMatch.test(memoData) && (
        <div data-testid="memo_data">
          <Trans
            i18nKey="vault_delete_memo_data"
            components={{
              MemoData: <b>{decodeHex(memoData)}</b>,
            }}
          />
        </div>
      )}
    </>
  )
}
