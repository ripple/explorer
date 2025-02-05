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
      <SimpleRow label={t('asset1')} data-testid="asset1">
        <Currency currency={Asset.currency} issuer={Asset.issuer} />
      </SimpleRow>
      <SimpleRow label={t('asset2')} data-testid="asset2">
        <Currency currency={Asset2.currency} issuer={Asset2.issuer} />
      </SimpleRow>
    </>
  )
}
