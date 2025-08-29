import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { DepositPreauth, CredentialAuth } from './types'
import { convertHexToString } from '../../../../../rippled/lib/utils'

const renderCredentials = (credentials: CredentialAuth[], t: any) => {
  return (
    <>
      {credentials.map((cred, index) => (
        <div key={`${cred.Issuer}-${cred.CredentialType}`}>
          <SimpleRow 
            label={index === 0 ? t('credential_issuer') : ''} 
            data-testid={`credential-issuer-${index}`}
          >
            {cred.Issuer}
          </SimpleRow>
          <SimpleRow 
            label={index === 0 ? t('credential_type') : ''} 
            data-testid={`credential-type-${index}`}
          >
            {convertHexToString(cred.CredentialType)}
          </SimpleRow>
        </div>
      ))}
    </>
  )
}

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
      <>
        <SimpleRow label={t('authorize')} data-testid="authorize-credentials-label">
          {t('accepted_credentials')}
        </SimpleRow>
        {renderCredentials(AuthorizeCredentials, t)}
      </>
    )
  }

  if (UnauthorizeCredentials && UnauthorizeCredentials.length > 0) {
    return (
      <>
        <SimpleRow label={t('unauthorize')} data-testid="unauthorize-credentials-label">
          {t('accepted_credentials')}
        </SimpleRow>
        {renderCredentials(UnauthorizeCredentials, t)}
      </>
    )
  }

  return null
}
