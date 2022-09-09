import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import PayStringHeader from './PayStringHeader'
import PayStringMappingsTable from './PayStringMappingsTable'
import NoMatch from '../NoMatch'

import './styles.scss'
import {
  analytics,
  ANALYTIC_TYPES,
  NOT_FOUND,
  BAD_REQUEST,
} from '../shared/utils'

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

class PayString extends Component {
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
      <div className="paystring-page">
        <NoMatch title={message.title} hints={message.hints} />
      </div>
    )
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'PayStrings',
      path: '/paystrings',
    })
  }

  componentWillUnmount() {
    window.scrollTo(0, 0)
  }

  render() {
    const { t, error, match, language } = this.props
    const { prevId } = this.state
    const accountId = match.params.id || ''
    const showError = accountId === prevId && error

    document.title = `${t('xrpl_explorer')} | ${accountId.substr(0, 24)}${
      accountId.length > 24 ? '...' : ''
    }`

    return showError ? (
      PayString.renderError(error)
    ) : (
      <div className="paystring-page">
        {accountId && (
          <PayStringHeader language={language} accountId={accountId} t={t} />
        )}
        {accountId && <PayStringMappingsTable accountId={accountId} t={t} />}
        {!accountId && (
          <div style={{ textAlign: 'center', fontSize: '14px' }}>
            <h2>Enter an account ID in the search box</h2>
          </div>
        )}
      </div>
    )
  }
}

PayString.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  error: PropTypes.number,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
}

PayString.defaultProps = {
  error: null,
}

export default connect((state) => ({
  width: state.app.width,
  error: state.accountHeader.status,
  language: state.app.language,
}))(withTranslation()(PayString))
