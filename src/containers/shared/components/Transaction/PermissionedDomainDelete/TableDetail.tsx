import { useTranslation } from 'react-i18next'
import { type PermissionedDomainDelete } from 'xrpl'
import { TransactionTableDetailProps } from '../types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<PermissionedDomainDelete>) => {
  const { t } = useTranslation()
  const { Account, DomainID } = instructions
  return (
    <div className="permissionedDomainDelete">
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
    </div>
  )
}
