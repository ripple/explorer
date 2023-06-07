import { Trans } from 'react-i18next'
import { Account } from '../../Account'
import { TransactionDescriptionProps } from '../types'
import { DepositPreauth } from './types'

export function Description({
  data,
}: TransactionDescriptionProps<DepositPreauth>) {
  const { tx } = data
  return tx.Authorize ? (
    <div>
      <Trans i18nKey="deposit_auth">
        It Authorizes
        <Account account={tx.Authorize} />
        to send payments to the account
      </Trans>
    </div>
  ) : (
    <div>
      <Trans i18nKey="deposit_unauth">
        It removes the authorization for
        <Account account={tx.Unauthorize} />
        to send payments to the account
      </Trans>
    </div>
  )
}
