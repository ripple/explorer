import { useTranslation } from 'react-i18next'
import { type PermissionedDomainSet } from 'xrpl'
import { TransactionTableDetailProps } from '../types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<PermissionedDomainSet>) => {
  const { t } = useTranslation()
  const { AcceptedCredentials: acceptedCredentials } = instructions
  return (
    <div className="permissionedDomainSet">
      {acceptedCredentials.map((credential) => (
        <div>
          <div data-testid="cred-type">
            <span className="label">{t('credential_type')}: </span>
            <span className="case-sensitive">
              {credential.Credential.CredentialType}
            </span>
          </div>
          <div data-testid="cred-issuer">
            <span className="label">{t('credential_issuer')}: </span>
            <span className="case-sensitive">
              {credential.Credential.Issuer}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
