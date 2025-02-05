import { Trans } from 'react-i18next'
import { Account } from '../../Account'
import { TransactionDescriptionProps } from '../types'
import { DepositPreauth } from './types'

export const Description = ({
  data,
}: TransactionDescriptionProps<DepositPreauth>) => {
  const { tx } = data
  return tx.Authorize ? (
    <div data-testid="deposit-auth">
      <Trans i18nKey="deposit_auth">
        It Authorizes
        <Account account={tx.Authorize} />
        to send payments to the account
      </Trans>
    </div>
  ) : (
    <div data-testid="deposit-unauth">
      <Trans i18nKey="deposit_unauth">
        It removes the authorization for
        <Account account={tx.Unauthorize} />
        to send payments to the account
      </Trans>
    </div>
  )
}
