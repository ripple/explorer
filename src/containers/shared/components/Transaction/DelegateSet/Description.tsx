import { Trans } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'
import { DelegateSet } from './types'
import { Account } from '../../Account'

export const Description = ({
  data,
}: TransactionDescriptionProps<DelegateSet>) => {
  const { tx } = data
  const {
    Account: account,
    Authorize: authorize,
    Permissions: permissions,
  } = tx
  return (
    <Trans
      i18nKey="account_delegates_to"
      components={{
        Account: <Account account={account} />,
        Permissions: (
          <span className="flag">
            {permissions
              .map((permission) => permission.Permission.PermissionValue)
              .join(', ')}
          </span>
        ),
        Authorize: <Account account={authorize} />,
      }}
    />
  )
}
