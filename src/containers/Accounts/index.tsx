import { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { isValidClassicAddress, isValidXAddress } from 'ripple-address-codec'
import { AccountTransactionTable } from './AccountTransactionTable'
import './styles.scss'
import { useAnalytics } from '../shared/analytics'
import { useRouteParams } from '../shared/routing'
import { ACCOUNT_ROUTE } from '../App/routes'
import { BAD_REQUEST } from '../shared/utils'
import { getAccountState } from '../../rippled'
import SocketContext from '../shared/SocketContext'
import { Loader } from '../shared/components/Loader'
import { AccountSummary } from './AccountSummary'
import { useXRPToUSDRate } from '../shared/hooks/useXRPToUSDRate'
import AccountAsset from './AccountAsset'
import AccountHeader from './AccountHeader'

export const Accounts = () => {
  const { trackScreenLoaded, trackException } = useAnalytics()
  const { id: accountId = '' } = useRouteParams(ACCOUNT_ROUTE)
  const rippledSocket = useContext(SocketContext)

  const { data: account, isLoading } = useQuery(
    ['accountState', accountId],
    () => {
      if (!isValidClassicAddress(accountId) && !isValidXAddress(accountId)) {
        return Promise.reject(BAD_REQUEST)
      }

      return getAccountState(accountId, rippledSocket).catch((requestError) => {
        const status = requestError.code
        trackException(
          `ledger ${accountId} --- ${JSON.stringify(requestError)}`,
        )
        return Promise.reject(status)
      })
    },
  )

  useEffect(() => {
    trackScreenLoaded()

    return () => {
      window.scrollTo(0, 0)
    }
  }, [trackScreenLoaded])

  const xrpToUSDRate = useXRPToUSDRate()

  const isAccountDeleted = account?.deleted === true
  // Show account data only after account.info is loaded and account isn't deleted
  const showAccount = !!account?.info && !isAccountDeleted

  return (
    <div className="accounts-page section">
      <Helmet title={`${accountId.substring(0, 12)}...`} />
      {accountId && (
        <>
          <AccountHeader
            isAccountDeleted={isAccountDeleted}
            accountId={accountId}
            account={account}
          />
          {showAccount && (
            <>
              <AccountSummary account={account} xrpToUSDRate={xrpToUSDRate} />
              <AccountAsset
                // Use account.account since `accountId` could be an extended account
                accountId={account.account}
                xrpToUSDRate={xrpToUSDRate}
              />
            </>
          )}

          {/* Show account transactions regardless of account delete status */}
          <AccountTransactionTable
            accountId={accountId}
            hasTokensColumn={false}
          />
        </>
      )}
      {isLoading && <Loader />}
    </div>
  )
}
