import { useTranslation } from 'react-i18next'
import { type PermissionedDomainSet } from 'xrpl'
import { TransactionTableDetailProps } from '../types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<PermissionedDomainSet>) => {
  const { t } = useTranslation()
  const { Account, DomainID, AcceptedCredentials } = instructions
  return (
    <div className="permissionedDomainSet">
      {Account && (
        <div className="account">
          <span className="label">{t('account')}: </span>
          <span className="case-sensitive">{Account}</span>
        </div>
      )}
      {DomainID && (
        <div className="domainId">
          <span className="label">{t('domain_id')}: </span>
          <span className="case-sensitive">{DomainID}</span>
        </div>
      )}
      {AcceptedCredentials && (
        <div className="acceptedCredentials">
          <span className="label">{t('accepted_credentials')}: </span>
          <span className="case-sensitive">{AcceptedCredentials}</span>
        </div>
      )}
    </div>
  )
}
