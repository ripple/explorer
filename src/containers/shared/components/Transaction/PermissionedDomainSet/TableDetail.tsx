import { useTranslation } from 'react-i18next'
import { type PermissionedDomainSet } from 'xrpl'
import { TransactionTableDetailProps } from '../types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<PermissionedDomainSet>) => {
  const { t } = useTranslation()
  const { DomainID, AcceptedCredentials } = instructions
  return (
    <div className="permissionedDomainSet">
      <div className="domainId">
        <span className="label">{t('domain_id')}: </span>
        <span className="case-sensitive">{DomainID}</span>
      </div>

      <div className="acceptedCredentials">
        <span className="label">{t('accepted_credentials')}: </span>
        <span className="case-sensitive">{AcceptedCredentials}</span>
      </div>
    </div>
  )
}
