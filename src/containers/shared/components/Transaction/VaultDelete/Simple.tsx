import { useTranslation } from 'react-i18next'
import type { VaultDelete } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<VaultDelete>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { VaultID: vaultId } = data.instructions
  return (
    <SimpleRow label={t('vault_id')} data-testid="vault_id">
      {vaultId}
    </SimpleRow>
  )
}
