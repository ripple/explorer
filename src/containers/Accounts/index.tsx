import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import AccountHeader from './AccountHeader'
import { AccountTransactionTable } from './AccountTransactionTable'
import './styles.scss'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'
import { Tabs } from '../shared/components/Tabs'
import { AccountAssetTab } from './AccountAssetTab/AccountAssetTab'
import { buildPath, useRouteParams } from '../shared/routing'
import { ACCOUNT } from '../App/routes'

export const Accounts = () => {
  const { id: accountId = '', tab = 'transactions' } = useRouteParams(ACCOUNT)
  const [currencySelected, setCurrencySelected] = useState('XRP')
  const mainPath = buildPath(ACCOUNT, { id: accountId })

  useEffect(() => {
    analytics(ANALYTIC_TYPES.pageview, { title: 'Accounts', path: '/accounts' })

    return () => {
      window.scrollTo(0, 0)
    }
  })

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
