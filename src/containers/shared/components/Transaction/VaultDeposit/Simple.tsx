import { useTranslation } from 'react-i18next'
import type { VaultDeposit } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<VaultDeposit>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { VaultID: vaultId, Amount: amount } = data.instructions
  return (
    <>
      <SimpleRow label={t('vault_id')} data-testid="vault_id">
        {vaultId}
      </SimpleRow>
      <SimpleRow label={t('amount')} data-testid="amount">
        <Amount value={formatAmount(amount)} />
      </SimpleRow>
    </>
  )
}
