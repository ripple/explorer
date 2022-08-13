import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import TokenHeader from './TokenHeader'
import TokenTransactionsTable from './TokenTransactionsTable'
import DEXPairs from './DEXPairs'
import NoMatch from '../NoMatch'

import './styles.scss'
import {
  analytics,
  ANALYTIC_TYPES,
  NOT_FOUND,
  BAD_REQUEST,
} from '../shared/utils'

const IS_MAINNET = process.env.REACT_APP_ENVIRONMENT === 'mainnet'

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

class Token extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { match } = nextProps
    return {
      accountId: match.params.id,
      prevId: prevState && prevState.accountId,
    }
  }

  static renderError(error) {
    const message = getErrorMessage(error)
    return (
      <div className="token-page">
        <NoMatch title={message.title} hints={message.hints} />
      </div>
    )
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    analytics(ANALYTIC_TYPES.pageview, { title: 'Accounts', path: '/accounts' })
  }

  componentWillUnmount() {
    window.scrollTo(0, 0)
  }

  render() {
    const { t, error, match } = this.props
    const { prevId } = this.state
    const accountId = match.params.id || ''
    const currency = match.params.currency || ''
    const showError = accountId === prevId && error

    // TODO: title this so it includes the currency code somehow
    document.title = `${t('xrpl_explorer')} | ${accountId.substr(0, 12)}...`

    return showError ? (
      Token.renderError(error)
    ) : (
      <div className="token-page">
        {accountId && (
          <TokenHeader accountId={accountId} currency={currency} t={t} />
        )}
        {accountId && IS_MAINNET && (
          <DEXPairs accountId={accountId} currency={currency} t={t} />
        )}
        {accountId && (
          <TokenTransactionsTable
            accountId={accountId}
            currency={currency}
            t={t}
          />
        )}
        {!accountId && (
          <div style={{ textAlign: 'center', fontSize: '14px' }}>
            <h2>Enter an account ID in the search box</h2>
          </div>
        )}
      </div>
    )
  }
}

Token.propTypes = {
  t: PropTypes.func.isRequired,
  error: PropTypes.number,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      currency: PropTypes.string,
    }),
  }).isRequired,
}

Token.defaultProps = {
  error: null,
}

export default connect((state) => ({
  width: state.app.width,
  error: state.accountHeader.status,
}))(withTranslation()(Token))
