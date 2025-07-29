import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { VaultClawback } from './types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { Account } from '../../Account'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<VaultClawback>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { VaultID: vaultId, Holder: holder, Amount: amount } = data.instructions
  return (
    <>
      <SimpleRow label={t('vault_id')} data-testid="vault_id">
        {vaultId}
      </SimpleRow>
      <SimpleRow label={t('holder')} data-testid="holder">
        <Account account={holder} />
      </SimpleRow>
      {amount && (
        <SimpleRow label={t('amount')} data-testid="amount">
          <Amount value={formatAmount(amount)} />
        </SimpleRow>
      )}
    </>
  )
}
