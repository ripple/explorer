import { Trans } from 'react-i18next'
import type { VaultClawback } from 'xrpl'
import { TransactionDescriptionProps } from '../types'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Description = ({
  data,
}: TransactionDescriptionProps<VaultClawback>) => {
  const { tx } = data
  const { Account: account, Holder: holder, Amount: amount } = tx
  return (
    <Trans
      i18nKey="account_clawbacks_from_vault"
      components={{
        Account: <Account account={account} />,
        Holder: <Account account={holder} />,
        Amount: amount ? (
          <b>
            {' '}
            <Amount value={formatAmount(amount)} />
          </b>
        ) : (
          <span />
        ),
      }}
    />
  )
}
