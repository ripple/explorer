import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { VaultSet } from './types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { isValidJsonString } from '../../../utils'
import { JsonView } from '../../JsonView'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<VaultSet>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { VaultID, Data, AssetsMaximum, DomainID } = data.instructions
  return (
    <>
      <SimpleRow label={t('vault_id')} data-testid="vault_id">
        {VaultID}
      </SimpleRow>
      {AssetsMaximum && (
        <SimpleRow label={t('assets_maximum')} data-testid="assets_maximum">
          <Amount value={AssetsMaximum} />
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
