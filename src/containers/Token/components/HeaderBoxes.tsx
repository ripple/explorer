import { useTranslation } from 'react-i18next'

import './styles.scss'
import { Link } from 'react-router-dom'
import { formatLargeNumber, formatPrice } from '../../shared/utils'

export interface OverviewData {
  issuer: string
  price: string
  holders: number
  trustlines: number
  transfer_fee: number
  reputation_level: number
}

export interface MarketData {
  supply: string
  circ_supply: string
  market_cap: string
  volume_24h: string
  trades_24h: string
  amm_tvl: string
}

interface HeaderBoxesProps {
  overviewData: OverviewData
  marketData: MarketData
  xrpUSDRate: string
}

export const HeaderBoxes = ({
  overviewData,
  marketData,
  xrpUSDRate,
}: HeaderBoxesProps): JSX.Element => {
  const { t } = useTranslation()
  const { issuer, price, holders, trustlines, transfer_fee, reputation_level } =
    overviewData
  const { supply, circ_supply, market_cap, volume_24h, trades_24h, amm_tvl } =
    marketData

  function truncateString(address, startLength = 6, endLength = 6) {
    if (!address || address.length <= startLength + endLength) {
      return address // nothing to truncate
    }
    const start = address.slice(0, startLength)
    const end = address.slice(-endLength)
    return `${start}...${end}`
  }

  const DEFAULT_DECIMALS = 1
  const formatDecimals = (
    val: number,
    decimals: number = DEFAULT_DECIMALS,
  ): string => {
    const rounded = Number(val.toFixed(decimals))

    if (rounded === 0 && val !== 0) {
      const str = val.toPrecision(1)
      return Number(str).toString()
    }

    return val.toFixed(decimals).replace(/\.?0+$/, '')
  }

  return (
    <div className="header-boxes">
      <div className="header-box">
        <div className="header-box-title">
          {t('token_page.general_overview')}
        </div>
        <div className="header-box-contents">
          <div className="header-box-item">
            <div className="item-name">{t('token_page.issuer')}:</div>
            <Link
              to={`/accounts/${issuer}`}
              replace
              className="item-value account-link"
            >
              {truncateString(issuer)}
            </Link>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.price')}:</div>
            <div className="item-value">
              {formatPrice(Number(price) * Number(xrpUSDRate))}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.holders')}:</div>
            <div className="item-value">{holders.toLocaleString()}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.trustlines')}:</div>
            <div className="item-value">{trustlines.toLocaleString()}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.transfer_fee')}:</div>
            <div className="item-value">{formatDecimals(transfer_fee, 2)}%</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.reputation_level')}:</div>
            <div className="item-value">
              {reputation_level > 0 ? (
                <div className="reputation-level">{reputation_level}</div>
              ) : (
                <div>--</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="header-box">
        <div className="header-box-title">{t('token_page.market_data')}</div>
        <div className="header-box-contents">
          <div className="header-box-item">
            <div className="item-name">{t('token_page.supply')}:</div>
            <div className="item-value">
              {formatDecimals(Number(supply), 2)}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">
              {t('token_page.circulating_supply')}:
            </div>
            <div className="item-value">{circ_supply}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.market_cap')}:</div>
            <div className="item-value">
              {Number(formatDecimals(Number(market_cap), 2)).toLocaleString()}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.volume_24h')}:</div>
            <div className="item-value">
              {Number(formatDecimals(Number(volume_24h), 2)).toLocaleString()}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.trades_24h')}:</div>
            <div className="item-value">
              {Number(trades_24h).toLocaleString()}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.amm_tvl')}:</div>
            <div className="item-value">{amm_tvl}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
