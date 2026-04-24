import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Account } from '../../shared/components/Account'
import { CollapsibleSection } from '../../shared/components/CollapsibleSection'
import { Loader } from '../../shared/components/Loader'
import { getAccountObjects } from '../../../rippled/lib/rippled'
import SocketContext from '../../shared/SocketContext'
import { shortenAccount } from '../../shared/utils'
import './styles.scss'

interface DelegateObject {
  Account: string
  Authorize: string
  Permissions: Array<{
    Permission: {
      PermissionValue: string
    }
  }>
  LedgerEntryType: string
}

interface PermissionDelegationProps {
  accountId: string
}

export const PermissionDelegation = ({
  accountId,
}: PermissionDelegationProps) => {
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)

  const { data, isLoading } = useQuery(
    ['accountDelegates', accountId],
    () => getAccountObjects(rippledSocket, accountId, 'delegate'),
    { enabled: !!accountId },
  )

  const delegates: DelegateObject[] = data?.account_objects ?? []

  // Don't render the section if there are no delegations and we're done loading
  if (!isLoading && delegates.length === 0) {
    return null
  }

  return (
    <section className="permission-delegation">
      <CollapsibleSection
        title={t('account_page_permission_delegation')}
        ariaLabel="Toggle permission delegation"
        defaultOpen
      >
        {isLoading ? (
          <Loader />
        ) : (
          <div className="delegate-list">
            {delegates.map((delegate) => (
              <div key={delegate.Authorize} className="delegate-item">
                <div className="delegate-authorize">
                  <Account
                    account={delegate.Authorize}
                    displayText={shortenAccount(delegate.Authorize)}
                  />
                </div>
                <div className="delegate-permissions">
                  {delegate.Permissions.map((perm) => (
                    <span
                      key={perm.Permission.PermissionValue}
                      className="permission-chip"
                    >
                      {perm.Permission.PermissionValue}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CollapsibleSection>
    </section>
  )
}

export default PermissionDelegation
