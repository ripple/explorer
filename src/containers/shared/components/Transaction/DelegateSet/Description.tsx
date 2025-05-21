import { useTranslation } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'
import { DelegateSet } from './types'
import { Account } from '../../Account'

export const Description = ({
  data,
}: TransactionDescriptionProps<DelegateSet>) => {
  const { t } = useTranslation()
  const { tx } = data
  const {
    Account: account,
    Authorize: authorize,
    Permissions: permissions,
  } = tx
  return (
    <>
      <Account account={account} />
      {` `}
      <span>{t('delegate')}</span>
      {` `}
      <span className="flag">
        {permissions
          .map((permission) => permission.Permission.PermissionValue)
          .join(', ')}
      </span>
      {` `}
      <span>{t('permissions')}</span>
      {` `}
      <span>{t('to')}</span>
      {` `}
      <Account account={authorize} />
    </>
  )
}
