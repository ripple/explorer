import { Trans } from 'react-i18next'
import { type AMMDelete } from 'xrpl'
import { TransactionDescriptionProps } from '../types'
import Currency from '../../Currency'
import { formatAsset } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Description = ({
  data,
}: TransactionDescriptionProps<AMMDelete>) => {
  const { Asset, Asset2 } = data.tx
  const asset1 = formatAsset(Asset)
  const asset2 = formatAsset(Asset2)

  return (
    <div data-testid="amm-delete-description">
      <Trans
        i18nKey="amm_delete_description"
        components={{
          Asset: (
            <Currency
              currency={asset1.currency}
              issuer={asset1.issuer}
              isMPT={asset1.isMPT}
            />
          ),
          Asset2: (
            <Currency
              currency={asset2.currency}
              issuer={asset2.issuer}
              isMPT={asset2.isMPT}
            />
          ),
        }}
      />
      <br />
      <Trans i18nKey="amm_delete_description_caveat" />
    </div>
  )
}
