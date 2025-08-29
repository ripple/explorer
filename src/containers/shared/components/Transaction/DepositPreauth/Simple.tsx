import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { SimpleGroup } from '../SimpleGroup'
import { TransactionSimpleProps } from '../types'
import { DepositPreauth, CredentialAuth } from './types'
import { convertHexToString } from '../../../../../rippled/lib/utils'

export const Simple = ({ data }: TransactionSimpleProps<DepositPreauth>) => {
  const { t } = useTranslation()
  const { Authorize, Unauthorize, AuthorizeCredentials, UnauthorizeCredentials } = data.instructions

  if (Authorize) {
    return (
      <SimpleRow label={t('authorize')} data-testid="authorize">
        {Authorize}
      </SimpleRow>
    )
  }

  if (Unauthorize) {
    return (
      <SimpleRow label={t('unauthorize')} data-testid="unauthorize">
        {Unauthorize}
      </SimpleRow>
    )
  }

  if (AuthorizeCredentials && AuthorizeCredentials.length > 0) {
    return (
      <SimpleGroup title={`${t('authorize')} ${t('accepted_credentials')}`}>
        {AuthorizeCredentials.map((cred, index) => (
          <div key={`${cred.Issuer}-${cred.CredentialType}`}>
            <SimpleRow 
              label={t('credential_issuer')} 
              data-testid={`credential-issuer-${index}`}
            >
              {cred.Issuer}
            </SimpleRow>
            <SimpleRow 
              label={t('credential_type')} 
              data-testid={`credential-type-${index}`}
            >
              {convertHexToString(cred.CredentialType)}
            </SimpleRow>
          </div>
        ))}
      </SimpleGroup>
    )
  }

  if (UnauthorizeCredentials && UnauthorizeCredentials.length > 0) {
    return (
      <SimpleGroup title={`${t('unauthorize')} ${t('accepted_credentials')}`}>
        {UnauthorizeCredentials.map((cred, index) => (
          <div key={`${cred.Issuer}-${cred.CredentialType}`}>
            <SimpleRow 
              label={t('credential_issuer')} 
              data-testid={`credential-issuer-${index}`}
            >
              {cred.Issuer}
            </SimpleRow>
            <SimpleRow 
              label={t('credential_type')} 
              data-testid={`credential-type-${index}`}
            >
              {convertHexToString(cred.CredentialType)}
            </SimpleRow>
          </div>
        ))}
      </SimpleGroup>
    )
  }

  return null
}
