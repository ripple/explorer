import { FC, PropsWithChildren, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { useParams } from 'react-router'
import { Helmet } from 'react-helmet-async'
import TokenHeader from './TokenHeader'
import { TokenTransactionTable } from './TokenTransactionTable'
import { DEXPairs } from './DEXPairs'
import NoMatch from '../NoMatch'

import './styles.scss'
import { NOT_FOUND, BAD_REQUEST } from '../shared/utils'
import { useAnalytics } from '../shared/analytics'
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

const Page: FC<PropsWithChildren<{ accountId: string }>> = ({
  accountId,
  children,
}) => (
  <div className="token-page">
    <Helmet title={`${accountId.substring(0, 12)}...`} />
    {children}
  </div>
)

const Token: FC<{ error: string }> = ({ error }) => {
  const { trackScreenLoaded } = useAnalytics()
  const { currency, id: accountId } = useParams<{
    currency: string
    id: string
  }>()
  const { t } = useTranslation()

  useEffect(() => {
    trackScreenLoaded({
      issuer: accountId,
      currency_code: currency,
    })

    return () => {
      window.scrollTo(0, 0)
    }
  }, [accountId, currency, trackScreenLoaded])

  const renderError = () => {
    const message = getErrorMessage(error)
    return <NoMatch title={message.title} hints={message.hints} />
  }

  if (error) {
    return <Page accountId={accountId}>{renderError()}</Page>
  }

  return (
    <Page accountId={accountId}>
      {accountId && <TokenHeader accountId={accountId} currency={currency} />}
      {accountId && IS_MAINNET && (
        <DEXPairs accountId={accountId} currency={currency} />
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
    </Page>
  )
}

export default connect((state: any) => ({
  error: state.accountHeader.status,
}))(Token)
