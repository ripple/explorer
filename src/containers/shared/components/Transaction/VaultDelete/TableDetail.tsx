import { t } from 'i18next'
import { TransactionTableDetailProps } from '../types'
import { VaultDelete } from './types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<VaultDelete>) => {
  const { VaultID: vaultId } = instructions
  return (
    <div className="vault-delete">
      <span className="label">{t('deletes')}</span>
      <span>
        {t('vault_delete_table_detail')} <b>{vaultId}</b>
      </span>
    </div>
  )
}
