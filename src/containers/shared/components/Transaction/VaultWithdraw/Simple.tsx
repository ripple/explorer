import { useTranslation } from 'react-i18next'
import type { VaultWithdraw } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { Account } from '../../Account'
import { CredentialIDs } from '../CredentialIDs'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<VaultWithdraw>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const {
    VaultID: vaultId,
    Amount: amount,
    Destination: destination,
  } = data.instructions
  // CredentialIDs is not yet part of the xrpl package's VaultWithdraw type.
  const credentialIds = (data.instructions as any).CredentialIDs as
    | string[]
    | undefined
  return (
    <>
      <SimpleRow
        label={t('vault_id')}
        className="vault-id"
        data-testid="vault_id"
      >
        {vaultId}
      </SimpleRow>
      <SimpleRow label={t('amount')} data-testid="amount">
        <Amount value={formatAmount(amount)} />
      </SimpleRow>
      {destination && (
        <SimpleRow label={t('destination')} data-testid="destination">
          <Account account={destination} />
        </SimpleRow>
      )}
      {credentialIds && credentialIds.length > 0 && (
        <CredentialIDs credentialIDs={credentialIds} />
      )}
    </>
  )
}
