import { useTranslation } from 'react-i18next'
import type { VaultDelete } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { decodeHex, hexMatch } from '../../../transactionUtils'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<VaultDelete>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { VaultID: vaultId, MemoData: memoData } = data.instructions
  return (
    <>
      <SimpleRow
        label={t('vault_id')}
        className="vault-id"
        data-testid="vault_id"
      >
        {vaultId}
      </SimpleRow>
      {memoData && hexMatch.test(memoData) && (
        <SimpleRow
          label={t('memo_data')}
          className="dt"
          data-testid="memo_data"
        >
          {decodeHex(memoData)}
        </SimpleRow>
      )}
    </>
  )
}
