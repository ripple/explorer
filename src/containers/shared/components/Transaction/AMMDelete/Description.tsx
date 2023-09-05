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
          // @ts-expect-error -- Fixed by https://github.com/XRPLF/xrpl.js/pull/2451
          Asset: <Currency currency={Asset.currency} issuer={Asset.issuer} />,
          Asset2: (
            <Currency
              currency={Asset2.currency}
              // @ts-expect-error -- Fixed by https://github.com/XRPLF/xrpl.js/pull/2451
              issuer={Asset2.issuer}
            />
          ),
        }}
      />
      <br />
      <Trans i18nKey="amm_delete_description_caveat" />
    </div>
  )
}
