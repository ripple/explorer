import { Trans } from 'react-i18next'
import { type AMMDelete } from 'xrpl'
import { TransactionDescriptionProps } from '../types'
import Currency from '../../Currency'

export const Description = ({
  data,
}: TransactionDescriptionProps<AMMDelete>) => {
  const { Asset, Asset2 } = data.tx

  return (
    <div data-test="amm-delete-description">
      <Trans
        i18nKey="amm_delete_description"
        components={{
          // @ts-expect-error - MPT is not being supported for AMM transactions until https://github.com/XRPLF/rippled/pull/5285 is merged
          Asset: <Currency currency={Asset.currency} issuer={Asset.issuer} />,
          Asset2: (
            // @ts-expect-error - MPT is not being supported for AMM transactions until https://github.com/XRPLF/rippled/pull/5285 is merged
            <Currency currency={Asset2.currency} issuer={Asset2.issuer} />
          ),
        }}
      />
      <br />
      <Trans i18nKey="amm_delete_description_caveat" />
    </div>
  )
}
