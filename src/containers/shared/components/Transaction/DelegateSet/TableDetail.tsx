import { useTranslation, Trans } from 'react-i18next'
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
      <Trans
        i18nKey="delegate_to"
        components={{
          DelegateLabel: <span className="label">{t('delegate')}</span>,
          Permissions: (
            <span className="flag">
              {Permissions.map(
                (permission) => permission.Permission.PermissionValue,
              ).join(', ')}
            </span>
          ),
          Account: <Account account={Authorize} />,
        }}
      />
    </div>
  )
}
