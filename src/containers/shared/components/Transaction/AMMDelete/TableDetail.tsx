import { useTranslation } from 'react-i18next'
import { type AMMDelete } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import Currency from '../../Currency'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<AMMDelete>) => {
  const { t } = useTranslation()
  const { Asset, Asset2 } = instructions

  return (
    <div className="ammDelete">
      <div data-testid="asset">
        <span className="label">{t('asset1')}</span>
        {/* @ts-expect-error - MPT is not being supported for AMM transactions until https://github.com/XRPLF/rippled/pull/5285 is merged */}
        <Currency currency={Asset.currency} issuer={(Asset as any).issuer} />
      </div>
      <div data-testid="asset2">
        <span className="label">{t('asset2')}</span>
        {/* @ts-expect-error - MPT is not being supported for AMM transactions until https://github.com/XRPLF/rippled/pull/5285 is merged */}
        <Currency currency={Asset2.currency} issuer={(Asset2 as any).issuer} />
      </div>
    </div>
  )
}
