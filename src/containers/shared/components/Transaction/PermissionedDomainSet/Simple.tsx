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

  console.log(acceptedCredentials)
  acceptedCredentials.map((credential) => {
    console.log(credential.Credential.CredentialType)
  })

  return (
    <SimpleRow
      label={t('accepted_credentials')}
      data-test="accepted-credentials"
    >
      {acceptedCredentials.map((credential) => (
        <div>
          <SimpleRow label={t('credential_type')} data-test="cred-type">
            {credential.Credential.CredentialType}
          </SimpleRow>
          <SimpleRow label={t('credential_issuer')} data-test="cred-issuer">
            {credential.Credential.Issuer}
          </SimpleRow>
        </div>
      ))}
    </SimpleRow>
  )
}

export { Simple }
