// import axios from 'axios'
import { useQuery } from 'react-query'
import { useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { Loader } from '../shared/components/Loader'
import axios from 'axios'
import Log from '../shared/log'
import { TokensTable } from './TokensTable'
import {
  FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS,
  ORACLE_ACCOUNT,
} from '../shared/utils'
import { getAccountLines } from '../../rippled/lib/rippled'
import SocketContext from '../shared/SocketContext'
import tokensData from './mockTokens.json'
import './tokens.scss'

const Filter = ({ categories, filterField, setFilterField }) => {
  const { t } = useTranslation()

  const handleClick = (cat) => {
    if (filterField === cat) {
      setFilterField('')
    } else {
      setFilterField(cat)
    }
  }

  return (
    <div className="filter">
      <div className="filter-icon" />
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-field ${cat === filterField ? 'selected' : ''}`}
          onClick={() => handleClick(cat)}
          type="button"
        >
          <div className={`item-icon icon-${cat}`} />
          <div className="filter-label">{t(cat)}</div>
        </button>
      ))}
    </div>
  )
}

export const Tokens = () => {
  const rippledSocket = useContext(SocketContext)
  const [sortField, setSortField] = useState('market_cap')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterField, setFilterField] = useState('')
  const { t } = useTranslation()
  const filterCategories = ['rwa', 'stablecoin', 'wrapped', 'memes']

  console.log(filterField)

  const { data: tokensData = [] } = useQuery(
    ['fetchTokens'],
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

  const filteredTokens = useMemo(() => {
    if (!tokensData || !tokensData.tokens) return []

    if (filterField === '') {
      return tokensData.tokens
    }

    return tokensData.tokens.filter(
      (token) =>
        token.meta.token.asset_class === filterField ||
        token.meta.token.asset_subclass === filterField,
    )
  }, [tokensData, filterField])

  console.log(filteredTokens)
  const fetchTokens = () =>
    axios.get('https://los.dev.ripplex.io/tokens').then((response) => {
      console.log(response.data)
      return response.data
    })
  const fetchXRPToUSDRate = () =>
    getAccountLines(rippledSocket, ORACLE_ACCOUNT, 1).then(
      (accountLines) => accountLines.lines[0]?.limit ?? 0.0,
    )
  // console.log(tokensData)
  return (
    <div className="tokens-page">
      <div className="type">{t('tokens')}</div>
      {tokensData?.metrics && (
        <div className="metrics-wrapper">
          <div className="metric">
            <div className="title">{t('no_of_tokens')}</div>
            <div className="val">{tokensData.metrics.count}</div>
          </div>
          <div className="metric">
            <div className="title">{t('market_cap')}</div>
            <div className="val">{tokensData.metrics.market_cap}</div>
          </div>
          <div className="metric">
            <div className="title">{t('volume_24h_total')}</div>
            <div className="val">{tokensData.metrics.volume_24h}</div>
          </div>
        </div>
      )}
      <Filter
        categories={filterCategories}
        filterField={filterField}
        setFilterField={setFilterField}
      />
      {filteredTokens.length > 0 ? (
        <TokensTable
          tokens={filteredTokens}
          xrpPrice={XRPUSDPrice}
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      ) : (
        <div className="empty-state">{t('no_tokens_found')}</div>
      )}
    </div>
  )
}
