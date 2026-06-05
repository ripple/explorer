import { useTranslation } from 'react-i18next'

import { type AMMDelete } from 'xrpl'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import Currency from '../../Currency'
import { formatAsset } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Simple = ({ data }: TransactionSimpleProps<AMMDelete>) => {
  const { t } = useTranslation()
  const { Asset, Asset2 } = data.instructions
  const asset1 = formatAsset(Asset)
  const asset2 = formatAsset(Asset2)

  return (
    <>
      <SimpleRow label={t('asset1')} data-testid="asset1">
        <Currency
          currency={asset1.currency}
          issuer={asset1.issuer}
          isMPT={asset1.isMPT}
        />
      </SimpleRow>
      <SimpleRow label={t('asset2')} data-testid="asset2">
        <Currency
          currency={asset2.currency}
          issuer={asset2.issuer}
          isMPT={asset2.isMPT}
        />
      </SimpleRow>
    </>
  )
}
