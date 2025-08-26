import { useTranslation } from 'react-i18next'

import './styles.scss'
import { Link } from 'react-router-dom'

export interface OverviewData {
  issuer: string
  price: string
  holders: number
  trustlines: number
  transfer_fee: string
  reputation_level: string
}

export interface MarketData {
  supply: string
  circ_supply: string
  market_cap: string
  volume_24h: string
  trades_24h: number
  amm_tvl: string
}

interface HeaderBoxesProps {
  overviewData: OverviewData
  marketData: MarketData
}

export const HeaderBoxes = ({
  overviewData,
  marketData,
}: HeaderBoxesProps): JSX.Element => {
  const { t } = useTranslation()
  const { issuer, price, holders, trustlines, transfer_fee, reputation_level } =
    overviewData
  const { supply, circ_supply, market_cap, volume_24h, trades_24h, amm_tvl } =
    marketData

  function truncateXrplAddress(address, startLength = 6, endLength = 6) {
    if (!address || address.length <= startLength + endLength) {
      return address // nothing to truncate
    }
    const start = address.slice(0, startLength)
    const end = address.slice(-endLength)
    return `${start}...${end}`
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
              {truncateXrplAddress(issuer)}
            </Link>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.price')}:</div>
            <div className="item-value">{price}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.holders')}:</div>
            <div className="item-value">{holders}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.trustlines')}:</div>
            <div className="item-value">{trustlines}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.transfer_fee')}:</div>
            <div className="item-value">{transfer_fee}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.reputation_level')}:</div>
            <div className="item-value">
              <div className="reputation-level">{reputation_level}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="header-box">
        <div className="header-box-title">{t('token_page.market_data')}</div>
        <div className="header-box-contents">
          <div className="header-box-item">
            <div className="item-name">{t('token_page.supply')}:</div>
            <div className="item-value">{supply}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">
              {t('token_page.circulating_supply')}:
            </div>
            <div className="item-value">{circ_supply}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.market_cap')}:</div>
            <div className="item-value">{market_cap}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.volume_24h')}:</div>
            <div className="item-value">{volume_24h}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.trades_24h')}:</div>
            <div className="item-value">{trades_24h}</div>
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
