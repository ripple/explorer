import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { DelegateSet } from './types'
import { SimpleRow } from '../SimpleRow'
import { Account } from '../../Account'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<DelegateSet>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { Authorize, Permissions } = data.instructions
  return (
    <>
      <SimpleRow label={t('authorize')} data-testid="authorize">
        <Account account={Authorize} />
      </SimpleRow>
      <SimpleRow
        label={t('permissions')}
        data-testid="permissions"
        className="flag"
      >
        {Permissions.map((permission) => (
          <div>{permission.Permission.PermissionValue}</div>
        ))}
      </SimpleRow>
    </>
  )
}
