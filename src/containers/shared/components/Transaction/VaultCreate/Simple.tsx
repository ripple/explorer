import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { VaultCreate } from './types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import Currency from '../../Currency'
import { ExplorerAmount } from '../../../types'
import { isValidJsonString } from '../../../utils'
import { JsonView } from '../../JsonView'

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
  const assetsMax: ExplorerAmount | null = AssetsMaximum
    ? { ...Asset, amount: AssetsMaximum }
    : null
  return (
    <>
      <SimpleRow label={t('asset')} data-testid="asset">
        <Currency currency={Asset.currency} issuer={Asset.issuer} />
      </SimpleRow>
      {assetsMax && (
        <SimpleRow label={t('assets_maximum')} data-testid="assets_maximum">
          <Amount value={assetsMax} />
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
          {isValidJsonString(DomainID) ? (
            <JsonView data={JSON.parse(DomainID)} />
          ) : (
            DomainID
          )}
        </SimpleRow>
      )}
    </>
  )
}
