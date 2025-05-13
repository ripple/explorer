import { useTranslation } from 'react-i18next'

import { type AMMDelete } from 'xrpl'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import Currency from '../../Currency'

export const Simple = ({ data }: TransactionSimpleProps<AMMDelete>) => {
  const { t } = useTranslation()
  const { Asset, Asset2 } = data.instructions

  return (
    <>
      <SimpleRow label={t('asset1')} data-test="asset1">
        {/* @ts-expect-error - MPT is not being supported for AMM transactions until https://github.com/XRPLF/rippled/pull/5285 is merged */}
        <Currency currency={Asset.currency} issuer={Asset.issuer} />
      </SimpleRow>
      <SimpleRow label={t('asset2')} data-test="asset2">
        {/* @ts-expect-error - MPT is not being supported for AMM transactions until https://github.com/XRPLF/rippled/pull/5285 is merged */}
        <Currency currency={Asset2.currency} issuer={Asset2.issuer} />
      </SimpleRow>
    </>
  )
}
