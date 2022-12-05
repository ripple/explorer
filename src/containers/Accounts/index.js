import React, { useEffect, useState } from 'react'
import { useParams, useRouteMatch } from 'react-router'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import AccountHeader from './AccountHeader'
import { AccountTransactionTable } from './AccountTransactionTable'

import './styles.scss'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'
import { Tabs } from '../shared/components/Tabs'

import { AccountAssetTab } from './AccountAssetTab/AccountAssetTab'

const Accounts = (props) => {
  const { id: accountId, tab = 'transactions' } = useParams()
  const { path = '/' } = useRouteMatch()
  const { t } = useTranslation()
  const [currencySelected, setCurrencySelected] = useState('XRP')
  const mainPath = `${path.split('/:')[0]}/${accountId}`

  useEffect(() => {
    analytics(ANALYTIC_TYPES.pageview, { title: 'Accounts', path: '/accounts' })

    return () => {
      window.scrollTo(0, 0)
    }
  })

  document.title = `${t('xrpl_explorer')} | ${accountId.substr(0, 12)}...`
  const tabs = ['transactions', 'assets']

  return (
    <div className="accounts-page section">
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
            />
          )}
          {tab === 'assets' && <AccountAssetTab />}
        </>
      )}
      {!accountId && (
        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <h2>Enter an account ID in the search box</h2>
        </div>
      )}
    </div>
  )
}

Accounts.defaultProps = {
  error: null,
}

export default connect((state) => ({
  error: state.accountHeader.status,
}))(Accounts)
