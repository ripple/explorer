import { Trans } from 'react-i18next'
import type { VaultCreate } from 'xrpl'
import { TransactionDescriptionProps } from '../types'
import { Account } from '../../Account'
import Currency from '../../Currency'
import { MPTokenLink } from '../../MPTokenLink'

export const Description = ({
  data,
}: TransactionDescriptionProps<VaultCreate>) => {
  const { tx } = data
  const { Account: account, Asset: asset } = tx
  // @ts-expect-error -- necessary to check for MPT
  const mptIssuanceId = asset.mpt_issuance_id
  const isMPT = mptIssuanceId != null
  return (
    <Trans
      i18nKey="account_creates_vault"
      components={{
        Account: <Account account={account} />,
        Asset: isMPT ? (
          <MPTokenLink tokenID={mptIssuanceId} />
        ) : (
          <Currency
            // @ts-expect-error -- this is fine
            currency={asset.currency}
            // @ts-expect-error -- this is fine
            issuer={asset.issuer}
            isMPT={isMPT}
          />
        ),
      }}
    />
  )
}
