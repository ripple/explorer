import React, { useEffect } from 'react'
import { useParams, useRouteMatch } from 'react-router'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import AMMAccountHeader from 'containers/Accounts/AMM/AMMAccounts/AMMAccountHeader'
import AMMAccountTxTable from 'containers/Accounts/AMM/AMMTransactionTable'
import NoMatch from 'containers/NoMatch'

import 'containers/Accounts/styles.scss'
import {
  analytics,
  ANALYTIC_TYPES,
  NOT_FOUND,
  BAD_REQUEST,
} from 'containers/shared/utils'
import Tabs from 'containers/shared/components/Tabs'
import { AccountAssetTab } from 'containers/Accounts/AccountAssetTab/AccountAssetTab'

const ERROR_MESSAGES: { [index: string]: any } = {}
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

export interface AmmProps {
  error: string
}

const getErrorMessage = (error: string) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

const AMMAccounts = (props: AmmProps) => {
  const { id: accountId, tab = 'transactions' } = useParams<{
    id: string
    tab: string
  }>()
  const { path = '/' } = useRouteMatch()
  const { t } = useTranslation()
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
  const txProps = {
    accountId,
  }
  return error ? (
    renderError()
  ) : (
    <div className="accounts-page section">
      {accountId && (
        <>
          <AMMAccountHeader accountId={accountId} />
          <Tabs tabs={tabs} selected={tab} path={mainPath} />
          {tab === 'transactions' && <AMMAccountTxTable {...txProps} />}
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

interface State {
  accountHeader: {
    status: string
  }
}

export default connect((state: State) => ({
  error: state.accountHeader.status,
}))(AMMAccounts)
