import { Trans } from 'react-i18next'
import { Account } from '../../Account'
import { TransactionDescriptionProps } from '../types'
import { DepositPreauth } from './types'
import { convertHexToString } from '../../../../../rippled/lib/utils'
import { parser } from './parser'

export const Description = ({
  data,
}: TransactionDescriptionProps<DepositPreauth>) => {
  const tx = parser(data.tx)

  if (tx.Authorize) {
    return (
      <div>
        <Trans i18nKey="deposit_auth">
          It Authorizes
          <Account account={tx.Authorize} />
          to send payments to the account
        </Trans>
      </div>
    )
  }

  if (tx.Unauthorize) {
    return (
      <div>
        <Trans i18nKey="deposit_unauth">
          It removes the authorization for
          <Account account={tx.Unauthorize} />
          to send payments to the account
        </Trans>
      </div>
    )
  }

  if (tx.AuthorizeCredentials && tx.AuthorizeCredentials.length > 0) {
    return (
      <div>
        <p>It authorizes the following credentials:</p>
        <ul>
          {tx.AuthorizeCredentials.map((cred) => (
            <li key={`${cred.Issuer}-${cred.CredentialType}`}>
              <strong>{convertHexToString(cred.CredentialType)}</strong> from{' '}
              <Account account={cred.Issuer} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (tx.UnauthorizeCredentials && tx.UnauthorizeCredentials.length > 0) {
    return (
      <div>
        <p>It removes the authorization for the following credentials:</p>
        <ul>
          {tx.UnauthorizeCredentials.map((cred) => (
            <li key={`${cred.Issuer}-${cred.CredentialType}`}>
              <strong>{convertHexToString(cred.CredentialType)}</strong> from{' '}
              <Account account={cred.Issuer} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return null
}
