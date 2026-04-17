import { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import ArrowIcon from '../../shared/images/down_arrow.svg'
import { Account } from '../../shared/components/Account'
import { Loader } from '../../shared/components/Loader'
import { EmptyMessageTableRow } from '../../shared/EmptyMessageTableRow'
import { getAccountObjects } from '../../../rippled/lib/rippled'
import SocketContext from '../../shared/SocketContext'
import { shortenAccount } from '../../shared/utils'
import '../AccountAsset/styles.scss'
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
  const [isOpen, setIsOpen] = useState(true)

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
    <section className="account-asset permission-delegation">
      <div className="asset-section-header">
        <h3 className="account-asset-title">
          {t('account_page_permission_delegation')}
        </h3>
        <button
          type="button"
          className="asset-section-toggle"
          onClick={() => setIsOpen((s) => !s)}
          aria-expanded={isOpen}
          aria-label="Toggle permission delegation"
        >
          <ArrowIcon
            className={`asset-section-arrow ${isOpen ? 'open' : ''}`}
          />
        </button>
      </div>
      {isOpen && (
        <div className="permission-delegation-table-wrapper">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="account-asset-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      {t(
                        'account_page_permission_delegation_column_permission',
                      )}
                    </th>
                    <th>
                      {t(
                        'account_page_permission_delegation_column_granted_to',
                      )}
                    </th>
                    <th>
                      {t('account_page_permission_delegation_column_status')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {delegates.length === 0 ? (
                    <EmptyMessageTableRow colSpan={3}>
                      {t('account_page_permission_delegation_no_delegations')}
                    </EmptyMessageTableRow>
                  ) : (
                    delegates.flatMap((delegate) =>
                      delegate.Permissions.map((perm) => (
                        <tr
                          key={`${delegate.Authorize}-${perm.Permission.PermissionValue}`}
                        >
                          <td>{perm.Permission.PermissionValue}</td>
                          <td>
                            <Account
                              account={delegate.Authorize}
                              displayText={shortenAccount(delegate.Authorize)}
                            />
                          </td>
                          <td>
                            {t(
                              'account_page_permission_delegation_status_active',
                            )}
                          </td>
                        </tr>
                      )),
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default PermissionDelegation
