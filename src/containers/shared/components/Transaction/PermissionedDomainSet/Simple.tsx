import { useTranslation } from 'react-i18next'
import { type PermissionedDomainSet } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'

const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<PermissionedDomainSet>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { AcceptedCredentials: acceptedCredentials } = data.instructions

  return (
    <SimpleRow
      label={t('accepted_credentials')}
      data-testid="accepted-credentials"
    >
      {acceptedCredentials.map((credential) => (
        <div>
          <SimpleRow label={t('credential_type')} data-testid="cred-type">
            {credential.Credential.CredentialType}
          </SimpleRow>
          <SimpleRow label={t('credential_issuer')} data-testid="cred-issuer">
            {credential.Credential.Issuer}
          </SimpleRow>
        </div>
      ))}
    </SimpleRow>
  )
}

export { Simple }
