import { Trans } from 'react-i18next'
import { type AMMDelete } from 'xrpl'
import { TransactionDescriptionProps } from '../types'
import { formatCurrencyString } from '../../Currency'

export const Description = ({
  data,
}: TransactionDescriptionProps<AMMDelete>) => {
  const { Asset, Asset2 } = data.tx

  return (
    <div data-test="amm-delete-description">
      <Trans
        i18nKey="amm_delete_description"
        components={{
          Asset: formatCurrencyString(
            Asset.currency,
            false,
            (Asset as any).issuer,
            false,
          ),
          Asset2: formatCurrencyString(
            Asset2.currency,
            false,
            (Asset2 as any).issuer,
            false,
          ),
        }}
      />
      <br />
      <Trans i18nKey="amm_delete_description_caveat" />
    </div>
  )
}
