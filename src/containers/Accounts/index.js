import React, { useEffect, useState } from 'react'
import { useParams, useRouteMatch } from 'react-router'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AccountHeader from './AccountHeader'
import AccountTransactionsTable from './AccountTransactionsTable'
import NoMatch from '../NoMatch'

import './styles.scss'
import {
  analytics,
  ANALYTIC_TYPES,
  NOT_FOUND,
  BAD_REQUEST,
} from '../shared/utils'
import Tabs from '../shared/components/Tabs'
import { AccountAssetTab } from './AccountAssetTab/AccountAssetTab'

const ERROR_MESSAGES = {}
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'account_not_found',
  hints: ['check_account_id'],
}
ERROR_MESSAGES[BAD_REQUEST] = {
  title: 'invalid_xrpl_address',
  hints: ['check_account_id'],
}
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
}

const getErrorMessage = (error) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

const Accounts = (props) => {
  const { id: accountId, tab = 'transactions' } = useParams()
  const { path = '/' } = useRouteMatch()
  const { t } = useTranslation()
  const [currencySelected, setCurrencySelected] = useState('XRP')
  const { error } = props
  const mainPath = `${path.split('/:')[0]}/${accountId}`

  function renderError() {
    const message = getErrorMessage(error)
    return (
      <div className="accounts-page">
        <NoMatch title={message.title} hints={message.hints} />
      </div>
    )
  }

  useEffect(() => {
    analytics(ANALYTIC_TYPES.pageview, { title: 'Accounts', path: '/accounts' })

    return () => {
      window.scrollTo(0, 0)
    }
  })

  document.title = `${t('xrpl_explorer')} | ${accountId.substr(0, 12)}...`

  const tabs = ['transactions', 'assets']

  return error ? (
    renderError()
  ) : (
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
            <AccountTransactionsTable
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

Accounts.propTypes = {
  error: PropTypes.number,
}

Accounts.defaultProps = {
  error: null,
}

export default connect((state) => ({
  error: state.accountHeader.status,
}))(Accounts)
