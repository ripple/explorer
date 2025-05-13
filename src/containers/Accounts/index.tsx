import { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { isValidClassicAddress, isValidXAddress } from 'ripple-address-codec'
import { AccountHeader } from './AccountHeader'
import { AccountTransactionTable } from './AccountTransactionTable'
import './styles.scss'
import { useAnalytics } from '../shared/analytics'
import { Tabs } from '../shared/components/Tabs'
import { AccountAssetTab } from './AccountAssetTab/AccountAssetTab'
import { buildPath, useRouteParams } from '../shared/routing'
import { ACCOUNT_ROUTE } from '../App/routes'
import { BAD_REQUEST } from '../shared/utils'
import { getAccountState } from '../../rippled'
import SocketContext from '../shared/SocketContext'
import { Loader } from '../shared/components/Loader'

export const Accounts = () => {
  const { trackScreenLoaded, trackException } = useAnalytics()
  const { id: accountId = '', tab = 'transactions' } =
    useRouteParams(ACCOUNT_ROUTE)
  const [currencySelected, setCurrencySelected] = useState('XRP')
  const mainPath = buildPath(ACCOUNT_ROUTE, { id: accountId })
  const rippledSocket = useContext(SocketContext)

  const { data: account, isLoading } = useQuery(
    ['accountState', accountId],
    () => {
      if (!isValidClassicAddress(accountId) && !isValidXAddress(accountId)) {
        return Promise.reject(BAD_REQUEST)
      }

      return getAccountState(accountId, rippledSocket).catch(
        (transactionRequestError) => {
          const status = transactionRequestError.code
          trackException(
            `ledger ${accountId} --- ${JSON.stringify(
              transactionRequestError,
            )}`,
          )
          return Promise.reject(status)
        },
      )
    },
  )

  useEffect(() => {
    trackScreenLoaded()

    return () => {
      window.scrollTo(0, 0)
    }
  }, [tab, trackScreenLoaded])

  const tabs = ['transactions', 'assets']

  return (
    <div className="accounts-page section">
      <Helmet title={`${accountId.substring(0, 12)}...`} />
      {accountId && (
        <>
          <AccountHeader
            account={account}
            accountId={accountId}
            onSetCurrencySelected={(currency) => setCurrencySelected(currency)}
            currencySelected={currencySelected}
          />
          <Tabs tabs={tabs} selected={tab} path={mainPath} />
          {tab === 'transactions' && (
            <AccountTransactionTable
              accountId={accountId}
              currencySelected={currencySelected}
              hasTokensColumn={false}
            />
          )}
          {tab === 'assets' && account && <AccountAssetTab account={account} />}
        </>
      )}
      {isLoading && <Loader />}
    </div>
  )
}
