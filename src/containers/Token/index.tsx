import { FC, PropsWithChildren, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Log from '../shared/log'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { TokenHeader } from './TokenHeader'
import { TokenTransactionTable } from './TokenTransactionTable'
import NoMatch from '../NoMatch'

import './styles.scss'
import {
  NOT_FOUND,
  BAD_REQUEST,
  ORACLE_ACCOUNT,
  FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS,
} from '../shared/utils'
import { useAnalytics } from '../shared/analytics'
import { ErrorMessages } from '../shared/Interfaces'
import { TOKEN_ROUTE } from '../App/routes'
import { useRouteParams } from '../shared/routing'
import { getToken } from '../../rippled'
import SocketContext from '../shared/SocketContext'
import { Loader } from '../shared/components/Loader'
import { getAccountLines } from '../../rippled/lib/rippled'
import getTokenHolders from '../../rippled/holders'

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
  const { trackScreenLoaded } = useAnalytics()
  const { token = '' } = useRouteParams(TOKEN_ROUTE)
  const [currency, accountId] = token.split('.')

  const {
    data: tokenData,
    error: tokenDataError,
    isLoading: isTokenDataLoading,
  } = useQuery({
    queryKey: ['token', currency, accountId],
    queryFn: () => getToken(currency, accountId),
  })

  const {
    data: holdersData,
    error: holdersError,
    isLoading: isHoldersDataLoading,
  } = useQuery({
    queryKey: ['holders', currency, accountId],
    queryFn: () => getTokenHolders(currency, accountId),
  })

  const rippledSocket = useContext(SocketContext)
  const fetchXRPToUSDRate = () =>
    getAccountLines(rippledSocket, ORACLE_ACCOUNT, 1).then(
      (accountLines) => accountLines.lines[0]?.limit ?? 0.0,
    )

  const { data: XRPUSDPrice = 0.0 } = useQuery(
    ['fetchXRPToUSDRate'],
    () => fetchXRPToUSDRate(),
    {
      refetchInterval: FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS,
      onError: (error) => {
        Log.error(error)
        return 0.0
      },
    },
  )

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
            //holdersData={holdersData}
            xrpUSDRate={XRPUSDPrice.toString()}
            holdersData={holdersData}
            isHoldersDataLoading={isHoldersDataLoading}
          />
        )
      )}

      {accountId && tokenData && (
        <div className="section">
          <TokenTransactionTable
            holdersData={holdersData}
            isHoldersDataLoading
            accountId={accountId}
            currency={currency}
          />
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
