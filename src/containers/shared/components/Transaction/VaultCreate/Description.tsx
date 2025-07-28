import { Trans } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'
import { VaultCreate } from './types'
import { Account } from '../../Account'
import Currency from '../../Currency'

export const Description = ({
  data,
}: TransactionDescriptionProps<VaultCreate>) => {
  const { tx } = data
  const { Account: account, Asset: asset } = tx
  return (
    <Trans
      i18nKey="account_creates_vault"
      components={{
        Account: <Account account={account} />,
        Asset: <Currency currency={asset.currency} issuer={asset.issuer} />,
      }}
    />
  )
}
