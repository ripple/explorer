import { FC, useEffect } from 'react'
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
import { ErrorMessages } from '../shared/Interfaces'

const IS_MAINNET = process.env.VITE_ENVIRONMENT === 'mainnet'

const ERROR_MESSAGES: ErrorMessages = {
  default: {
    title: 'generic_error',
    hints: ['not_your_fault'],
  },
  [NOT_FOUND]: {
    title: 'account_not_found',
    hints: ['check_account_id'],
  },
  [BAD_REQUEST]: {
    title: 'invalid_xrpl_address',
    hints: ['check_account_id'],
  },
}

const getErrorMessage = (error) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

const Token: FC<{ error: string }> = ({ error }) => {
  const { currency, id: accountId } = useParams<{
    currency: string
    id: string
  }>()
  const { t } = useTranslation()

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

  return error ? (
    renderError()
  ) : (
    <div className="token-page">
      {accountId && <TokenHeader accountId={accountId} currency={currency} />}
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

export default connect((state: any) => ({
  error: state.accountHeader.status,
}))(Token)
