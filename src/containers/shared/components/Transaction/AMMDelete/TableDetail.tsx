import { useTranslation } from 'react-i18next'
import { type AMMDelete } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import Currency from '../../Currency'
import { formatAsset } from '../../../../../rippled/lib/txSummary/formatAmount'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<AMMDelete>) => {
  const { t } = useTranslation()
  const { Asset, Asset2 } = instructions
  const asset1 = formatAsset(Asset)
  const asset2 = formatAsset(Asset2)

  return (
    <div className="ammDelete">
      <div data-testid="asset">
        <span className="label">{t('asset1')}</span>
        <Currency
          currency={asset1.currency}
          issuer={asset1.issuer}
          isMPT={asset1.isMPT}
        />
      </div>
      <div data-testid="asset2">
        <span className="label">{t('asset2')}</span>
        <Currency
          currency={asset2.currency}
          issuer={asset2.issuer}
          isMPT={asset2.isMPT}
        />
      </div>
    </div>
  )
}
