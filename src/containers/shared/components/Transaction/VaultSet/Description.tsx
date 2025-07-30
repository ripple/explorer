import { Trans } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'
import { VaultSet } from './types'
import { isValidJsonString } from '../../../utils'
import { JsonView } from '../../JsonView'

export const Description = ({
  data,
}: TransactionDescriptionProps<VaultSet>) => {
  const { tx } = data
  const { Data, AssetsMaximum: assetsMaximum, DomainID: domainId } = tx
  return (
    <div data-testid="desc">
      {Data && (
        <div data-testid="data">
          <Trans
            i18nKey="set_vault_data"
            components={{
              Data: (
                <div>
                  {isValidJsonString(Data) ? (
                    <JsonView data={JSON.parse(Data)} />
                  ) : (
                    <b>{Data}</b>
                  )}
                </div>
              ),
            }}
          />
        </div>
      )}
      {assetsMaximum && (
        <div data-testid="assets_maximum">
          <Trans
            i18nKey="set_vault_assets_maximum"
            components={{
              AssetsMaximum: <b>{assetsMaximum}</b>,
            }}
          />
        </div>
      )}
      {domainId && (
        <div data-testid="domain_id">
          <Trans
            i18nKey="set_vault_domain_id"
            components={{
              DomainID: (
                <div>
                  {isValidJsonString(domainId) ? (
                    <JsonView data={JSON.parse(domainId)} />
                  ) : (
                    domainId
                  )}
                </div>
              ),
            }}
          />
        </div>
      )}
    </div>
  )
}
