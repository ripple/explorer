import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, useRouteMatch } from 'react-router'
import AccountHeader from './AccountHeader'
import { AccountTransactionTable } from './AccountTransactionTable'
import './styles.scss'
import { useAnalytics } from '../shared/analytics'
import { Tabs } from '../shared/components/Tabs'
import { AccountAssetTab } from './AccountAssetTab/AccountAssetTab'

export const Accounts = () => {
  const { trackScreenLoaded } = useAnalytics()
  const { id: accountId, tab = 'transactions' } = useParams<{
    id: string
    tab: 'assets' | 'transactions'
  }>()
  const { path = '/' } = useRouteMatch()
  const [currencySelected, setCurrencySelected] = useState('XRP')
  const mainPath = `${path.split('/:')[0]}/${accountId}`

  useEffect(() => {
    trackScreenLoaded()

    return () => {
      window.scrollTo(0, 0)
    }
  }, [tab, trackScreenLoaded])

  const tabs = ['transactions', 'assets']

  return (
    <div className="accounts-page section">
      <Helmet title={`${accountId.substr(0, 12)}...`} />
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
