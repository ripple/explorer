import { Trans } from 'react-i18next'
import { t } from 'i18next'
import { TransactionDescriptionProps } from '../types'
import { VaultWithdraw } from './types'
import { Amount } from '../../Amount'
import { Account } from '../../Account'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Description = ({
  data,
}: TransactionDescriptionProps<VaultWithdraw>) => {
  const { tx } = data
  const {
    Account: account,
    VaultID: vaultId,
    Amount: amount,
    Destination: destination,
  } = tx
  return (
    <Trans
      i18nKey="account_withdraws_from_vault"
      components={{
        Account: <Account account={account} />,
        Amount: (
          <b>
            <Amount value={formatAmount(amount)} />
          </b>
        ),
        VaultID: <b>{vaultId}</b>,
        Destination: destination ? (
          <>
            <span> {t('to')} </span>
            <Account account={destination} />
          </>
        ) : (
          <span />
        ),
      }}
    />
  )
}
