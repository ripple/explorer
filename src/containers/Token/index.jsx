import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { useParams } from 'react-router'
import TokenHeader from './TokenHeader'
import { TokenTransactionTable } from './TokenTransactionTable'
import { DEXPairs } from './DEXPairs'
import NoMatch from '../NoMatch'

import './styles.scss'
import {
  analytics,
  ANALYTIC_TYPES,
  NOT_FOUND,
  BAD_REQUEST,
} from '../shared/utils'

const IS_MAINNET = process.env.VITE_ENVIRONMENT === 'mainnet'

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

const Token = ({ error }) => {
  const { currency, id: accountId } = useParams()
  const { t } = useTranslation()
  const showError = error

  useEffect(() => {
    document.title = `${t('xrpl_explorer')} | ${accountId.substr(0, 12)}...`
    analytics(ANALYTIC_TYPES.pageview, { title: 'Accounts', path: '/accounts' })

    return () => {
      window.scrollTo(0, 0)
    }
  }, [accountId, t])

  const renderError = () => {
    const message = getErrorMessage(error)
    return (
      <div className="token-page">
        <NoMatch title={message.title} hints={message.hints} />
      </div>
    )
  }

  return showError ? (
    renderError(error)
  ) : (
    <div className="token-page">
      {accountId && (
        <TokenHeader accountId={accountId} currency={currency} t={t} />
      )}
      {accountId && IS_MAINNET && (
        <DEXPairs accountId={accountId} currency={currency} t={t} />
      )}
      {accountId && (
        <div className="section">
          <h2>{t('token_transactions')}</h2>
          <TokenTransactionTable accountId={accountId} currency={currency} />
        </div>
      )}
      {!accountId && (
        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <h2>Enter an account ID in the search box</h2>
        </div>
      )}
    </div>
  )
}

Token.propTypes = {
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
  error: state.accountHeader.status,
}))(Token)
