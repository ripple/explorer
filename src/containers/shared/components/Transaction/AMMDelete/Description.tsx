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
          Asset: (
            <Currency
              currency={Asset.currency}
              issuer={(Asset as any).issuer}
            />
          ),
          Asset2: (
            <Currency
              currency={Asset2.currency}
              issuer={(Asset2 as any).issuer}
            />
          ),
        }}
      />
      <br />
      <Trans i18nKey="amm_delete_description_caveat" />
    </div>
  )
}
