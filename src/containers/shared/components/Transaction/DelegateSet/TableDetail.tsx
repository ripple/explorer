import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { DelegateSet } from './types'
import { Account } from '../../Account'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<DelegateSet>) => {
  const { t } = useTranslation()
  const { Authorize, Permissions } = instructions
  return (
    <div className="delegate-set">
      <span className="label">{t('delegate')}</span>
      <span className="flag">
        {Permissions.map(
          (permission) => permission.Permission.PermissionValue,
        ).join(', ')}
      </span>
      <span>{t('permissions')}</span>
      <span>{t('to')}</span>
      <Account account={Authorize} />
    </div>
  )
}
