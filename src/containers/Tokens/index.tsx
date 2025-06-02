import axios from 'axios'
import { useQuery } from 'react-query'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader } from '../shared/components/Loader'
import Log from '../shared/log'
import { TokensTable } from './TokensTable'
import {
  FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS,
  ORACLE_ACCOUNT,
} from '../shared/utils'
import { getAccountLines } from '../../rippled/lib/rippled'
import SocketContext from '../shared/SocketContext'
import './tokens.scss'

export const Tokens = () => {
  const rippledSocket = useContext(SocketContext)
  const [sortField, setSortField] = useState('market_cap')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const { t } = useTranslation()

  const { data: tokensData = [] } = useQuery(
    ['fetchTokens', sortField, sortOrder],
    () => fetchTokens(),
    {
      refetchInterval: 60 * 1000,
      onError: (error) => Log.error(error),
    },
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
  const fetchTokens = () =>
    axios
      .get('/api/v1/tokens', {
        params: {
          sort_by: sortField,
          order: sortOrder,
        },
      })
      .then((response) => {
        console.log(response.data)
        return response.data
      })
  const fetchXRPToUSDRate = () =>
    getAccountLines(rippledSocket, ORACLE_ACCOUNT, 1).then(
      (accountLines) => accountLines.lines[0]?.limit ?? 0.0,
    )
  return (
    <div className="tokens-page">
      <div className="type">{t('tokens')}</div>
      {tokensData?.metrics && (
        <div className="metrics-wrapper">
          <div className="metric">
            {t('no_of_tokens')}
            <div className="val">{tokensData.metrics.count}</div>
          </div>
          <div className="metric">
            {t('market_cap_total')}
            <div className="val">{tokensData.metrics.market_cap}</div>
          </div>
          <div className="metric">
            {t('volume_24h_total')}
            <div className="val">{tokensData.metrics.volume_24h}</div>
          </div>
        </div>
      )}
      {tokensData?.tokens?.length > 0 ? (
        <TokensTable
          tokens={tokensData.tokens}
          xrpPrice={XRPUSDPrice}
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      ) : (
        <Loader />
      )}
    </div>
  )
}
