import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { AccountHeader } from './AccountHeader'
import { AccountTransactionTable } from './AccountTransactionTable'
import './styles.scss'
import { useAnalytics } from '../shared/analytics'
import { Tabs } from '../shared/components/Tabs'
import { AccountAssetTab } from './AccountAssetTab/AccountAssetTab'
import { buildPath, useRouteParams } from '../shared/routing'
import { ACCOUNT_ROUTE } from '../App/routes'

export const Accounts = () => {
  const { trackScreenLoaded } = useAnalytics()
  const { id: accountId = '', tab = 'transactions' } =
    useRouteParams(ACCOUNT_ROUTE)
  const [currencySelected, setCurrencySelected] = useState('XRP')
  const mainPath = buildPath(ACCOUNT_ROUTE, { id: accountId })

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
          {tab === 'assets' && <AccountAssetTab />}
        </>
      )}
    </div>
  )
}
