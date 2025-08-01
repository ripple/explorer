import { useTranslation } from 'react-i18next'
import type { VaultCreate } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import Currency from '../../Currency'
import { isValidJsonString } from '../../../utils'
import { JsonView } from '../../JsonView'
import { MPTokenLink } from '../../MPTokenLink'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<VaultCreate>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const {
    Asset,
    AssetsMaximum,
    Data,
    MPTokenMetadata,
    WithdrawalPolicy,
    DomainID,
  } = data.instructions
  // @ts-expect-error -- necessary to check for MPT
  const mptIssuanceId = Asset.mpt_issuance_id
  const isMPT = mptIssuanceId != null
  return (
    <>
      <SimpleRow label={t('asset')} data-testid="asset">
        {isMPT ? (
          <MPTokenLink tokenID={mptIssuanceId} />
        ) : (
          <Currency
            // @ts-expect-error -- this is fine
            currency={Asset.currency}
            // @ts-expect-error -- this is fine
            issuer={Asset.issuer}
            isMPT={isMPT}
          />
        )}
      </SimpleRow>
      {AssetsMaximum && (
        <SimpleRow label={t('assets_maximum')} data-testid="assets_maximum">
          {AssetsMaximum}
        </SimpleRow>
      )}
      {Data && (
        <SimpleRow label={t('data')} className="dt" data-testid="data">
          {isValidJsonString(Data) ? (
            <JsonView data={JSON.parse(Data)} />
          ) : (
            Data
          )}
        </SimpleRow>
      )}
      {MPTokenMetadata && (
        <SimpleRow
          label={t('mptoken_metadata')}
          className="dt"
          data-testid="mptoken_metadata"
        >
          {isValidJsonString(MPTokenMetadata) ? (
            <JsonView data={JSON.parse(MPTokenMetadata)} />
          ) : (
            MPTokenMetadata
          )}
        </SimpleRow>
      )}
      {WithdrawalPolicy && (
        <SimpleRow
          label={t('withdrawal_policy')}
          data-testid="withdrawal_policy"
        >
          {WithdrawalPolicy}
        </SimpleRow>
      )}
      {DomainID && (
        <SimpleRow
          label={t('domain_id')}
          className="dt"
          data-testid="domain_id"
        >
          DomainID
        </SimpleRow>
      )}
    </>
  )
}
