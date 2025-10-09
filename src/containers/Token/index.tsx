import { FC, PropsWithChildren, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import Log from '../shared/log'
import { TokenHeader } from './TokenHeader'
import { TokenTransactionTable } from './TokenTransactionTable'
import NoMatch from '../NoMatch'

import './styles.scss'
import {
  NOT_FOUND,
  BAD_REQUEST,
  ORACLE_ACCOUNT,
  FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS,
  DROPS_TO_XRP_FACTOR,
} from '../shared/utils'
import { useAnalytics } from '../shared/analytics'
import { ErrorMessages } from '../shared/Interfaces'
import { TOKEN_ROUTE } from '../App/routes'
import { useRouteParams } from '../shared/routing'
import { getToken } from '../../rippled'
import SocketContext from '../shared/SocketContext'
import { Loader } from '../shared/components/Loader'
import { getAccountLines, getAMMInfo } from '../../rippled/lib/rippled'
import getTokenHolders from '../../rippled/holders'
import { getDexTrades, getTransfers } from '../../rippled/tokenTx'

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

  // get basic token stats and info
  const {
    data: tokenData,
    error: tokenDataError,
    isLoading: isTokenDataLoading,
  } = useQuery({
    queryKey: ['token', currency, accountId],
    queryFn: () => getToken(currency, accountId),
  })

  // get top holders information for calculations and holders table
  const {
    data: holdersData,
    error: holdersError,
    isLoading: isHoldersDataLoading,
  } = useQuery({
    queryKey: ['holders', currency, accountId],
    queryFn: () => getTokenHolders(currency, accountId),
  })

  // get XRP to USD rate
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

  // get dex trades and transfers for tables
  const {
    data: dexTrades,
    error: dexTradesError,
    isLoading: isDexTradesLoading,
  } = useQuery({
    queryKey: ['dexTrades', currency, accountId],
    queryFn: () => getDexTrades(currency, accountId),
  })
  const {
    data: transfers,
    error: transfersError,
    isLoading: isTransfersLoading,
  } = useQuery({
    queryKey: ['transfers', currency, accountId],
    queryFn: () => getTransfers(currency, accountId),
  })

  // get amm info for TVL calculation
  // note: only fetch xrp-<token> amm info to simplify API calls for most tokens
  const fetchAmmInfo = () =>
    getAMMInfo(
      rippledSocket,
      { currency: 'XRP' },
      { currency, issuer: accountId },
    ).then(
      (data) =>
        (Number(data.amm.amount) / DROPS_TO_XRP_FACTOR) * XRPUSDPrice * 2,
    )
  const {
    data: ammTvlData,
    error: ammTvlError,
    isLoading: isAmmTvlLoading,
  } = useQuery({
    queryKey: ['ammTvl', currency, accountId],
    queryFn: () => fetchAmmInfo(),
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
            tokenData={tokenData}
            xrpUSDRate={XRPUSDPrice.toString()}
            holdersData={holdersData}
            isHoldersDataLoading={isHoldersDataLoading}
            ammTvlData={ammTvlData}
            isAmmTvlLoading={isAmmTvlLoading}
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
            dexTrades={dexTrades}
            isDexTradesLoading={isDexTradesLoading}
            transfers={transfers}
            isTransfersLoading={isTransfersLoading}
            xrpUSDRate={XRPUSDPrice.toString()}
            tokenData={tokenData}
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
