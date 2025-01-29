import { useTranslation } from 'react-i18next'
import { type PermissionedDomainDelete } from 'xrpl'
import { TransactionTableDetailProps } from '../types'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<PermissionedDomainDelete>) => {
  const { t } = useTranslation()
  const { DomainID } = instructions
  return (
    <div className="permissionedDomainDelete">
      <div className="domainId">
        <span className="label">{t('domain_id')}: </span>
        <span className="case-sensitive">{DomainID}</span>
      </div>
    </div>
  )
}
