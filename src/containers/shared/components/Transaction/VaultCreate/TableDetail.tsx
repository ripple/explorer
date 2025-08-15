import { Trans } from 'react-i18next'
import { t } from 'i18next'
import type { VaultCreate } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import Currency from '../../Currency'
import { MPTokenLink } from '../../MPTokenLink'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<VaultCreate>) => {
  const { Asset: asset } = instructions
  // @ts-expect-error -- necessary to check for MPT
  const mptIssuanceId = asset.mpt_issuance_id
  const isMPT = mptIssuanceId != null
  return (
    <div className="vault-create">
      <span className="label">{t('transaction_action_CREATE')}</span>
      <Trans
        i18nKey="vault_create_table_detail"
        components={{
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
    </div>
  )
}
