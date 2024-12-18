import { FC, PropsWithChildren, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { TokenHeader } from './TokenHeader'
import { TokenTransactionTable } from './TokenTransactionTable'
import { DEXPairs } from './DEXPairs'
import NoMatch from '../NoMatch'

import './styles.scss'
import { NOT_FOUND, BAD_REQUEST } from '../shared/utils'
import { useAnalytics } from '../shared/analytics'
import { ErrorMessages } from '../shared/Interfaces'
import { TOKEN_ROUTE } from '../App/routes'
import { useRouteParams } from '../shared/routing'
import { getToken } from '../../rippled'
import SocketContext from '../shared/SocketContext'
import { Loader } from '../shared/components/Loader'

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

export const Token = () => {
  const rippledSocket = useContext(SocketContext)
  const { trackScreenLoaded } = useAnalytics()
  const { token = '' } = useRouteParams(TOKEN_ROUTE)
  const [currency, accountId] = token.split('.')
  const { t } = useTranslation()
  const {
    data: tokenData,
    error: tokenDataError,
    isLoading: isTokenDataLoading,
  } = useQuery({
    queryKey: ['token', currency, accountId],
    queryFn: () => getToken(currency, accountId, rippledSocket),
  })

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
    const message = getErrorMessage(tokenDataError)
    return <NoMatch title={message.title} hints={message.hints} />
  }

  if (tokenDataError) {
    return <Page accountId={accountId}>{renderError()}</Page>
  }

  return (
    <Page accountId={accountId}>
      {isTokenDataLoading ? (
        <Loader />
      ) : (
        tokenData && (
          <TokenHeader
            accountId={accountId}
            currency={currency}
            data={tokenData}
          />
        )
      )}
      {accountId && tokenData && IS_MAINNET && (
        <DEXPairs accountId={accountId} currency={currency} />
      )}
      {accountId && tokenData && (
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
