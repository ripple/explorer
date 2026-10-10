import { useTranslation } from 'react-i18next'
import type { VaultCreate } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import Currency from '../../Currency'
import { isValidJsonString, localizeDate } from '../../../utils'
import { JsonView } from '../../JsonView'
import { MPTokenLink } from '../../MPTokenLink'
import { TX_FLAGS, DATE_OPTIONS } from '../../../transactionUtils'
import { useLanguage } from '../../../hooks'
import { convertRippleDate } from '../../../../../rippled/lib/convertRippleDate'
import { VAULT_KINDS } from '../../../vaultUtils'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<VaultCreate>,
) => {
  const { t } = useTranslation()
  const language = useLanguage()
  const { data } = props
  const {
    Asset,
    AssetsMaximum,
    Data,
    MPTokenMetadata,
    WithdrawalPolicy,
    DomainID,
  } = data.instructions
  // VaultKind, SubscriptionDate and RedemptionDate are not yet part of the
  // xrpl package's VaultCreate type.
  const vaultKind = (data.instructions as any).VaultKind as number | undefined
  const subscriptionDate = (data.instructions as any).SubscriptionDate as
    | number
    | undefined
  const redemptionDate = (data.instructions as any).RedemptionDate as
    | number
    | undefined
  const formatVaultDate = (date: number) =>
    `${localizeDate(new Date(convertRippleDate(date)), language, DATE_OPTIONS)} ${
      DATE_OPTIONS.timeZone
    }`
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
          {TX_FLAGS.VaultCreate[WithdrawalPolicy] || WithdrawalPolicy}
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
      {vaultKind !== undefined && (
        <SimpleRow label={t('vault_kind')} data-testid="vault_kind">
          {VAULT_KINDS[vaultKind] ? t(VAULT_KINDS[vaultKind]) : vaultKind}
        </SimpleRow>
      )}
      {subscriptionDate !== undefined && (
        <SimpleRow
          label={t('subscription_date')}
          data-testid="subscription_date"
        >
          {formatVaultDate(subscriptionDate)}
        </SimpleRow>
      )}
      {redemptionDate !== undefined && (
        <SimpleRow label={t('redemption_date')} data-testid="redemption_date">
          {formatVaultDate(redemptionDate)}
        </SimpleRow>
      )}
    </>
  )
}
