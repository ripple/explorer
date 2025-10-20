import './styles.scss'
import { useTranslation } from 'react-i18next'
import Currency from '../../shared/components/Currency'
import {
  HeaderBoxes,
  MarketData,
  OverviewData,
} from '../components/HeaderBoxes'
import { LOSToken } from '../../shared/losTypes'
import { TokenHoldersData } from '../api/holders'

interface TokenHeaderProps {
  currency: string
  tokenData: LOSToken
  xrpUSDRate: string
  holdersData?: TokenHoldersData
  isHoldersDataLoading: boolean
  ammTvlData?: number
  isAmmTvlLoading: boolean
}

const calculateCirculatingSupply = (
  tokenData: LOSToken,
  holdersData: TokenHoldersData | undefined,
): number => {
  let circSupply = holdersData?.totalSupply || Number(tokenData.supply) || 0

  // For stablecoins, don't subtract large percentage holders from circulating supply
  if (tokenData.asset_subclass !== 'stablecoin' && holdersData) {
    holdersData.holders.forEach((holder) => {
      if (holder.percent >= 20) {
        circSupply -= holder.balance
      }
    })
  }

  return circSupply
}

export const TokenHeader = ({
  currency,
  tokenData,
  xrpUSDRate,
  holdersData,
  isHoldersDataLoading,
  ammTvlData,
  isAmmTvlLoading,
}: TokenHeaderProps) => {
  const { t } = useTranslation()
  const circSupply = calculateCirculatingSupply(tokenData, holdersData)
  const overviewData: OverviewData = {
    issuer: tokenData.issuer_name || tokenData.issuer_account,
    price: tokenData.price || '0',
    holders: tokenData.holders || 0,
    trustlines: tokenData.trustlines || 0,
    transfer_fee: tokenData.transfer_fee || 0,
  }

  const marketData: MarketData = {
    supply: holdersData?.totalSupply.toString() || tokenData.supply || '',
    circ_supply: circSupply.toString() || tokenData.circ_supply || '',
    market_cap: tokenData.market_cap || '',
    volume_24h: tokenData.daily_volume || '',
    trades_24h: tokenData.daily_trades || '',
    amm_tvl: ammTvlData?.toString() || '',
  }

  const tokenLogo = tokenData.icon
  const tokenURL = tokenData.issuer_domain
  return (
    <div className="box token-header">
      <div className="section token-indicator">
        <div className="token-label">{t('token_page.token_label')}</div>
        <div className="category-pill">
          <div className="category-text">{t('token_page.category_text')}</div>
        </div>
      </div>
      <div className="section box-header">
        <div className="token-info-group">
          {tokenLogo ? (
            <img
              className="token-logo"
              alt={`${currency} logo`}
              src={tokenLogo}
            />
          ) : (
            <div className="token-logo no-logo" />
          )}
          <Currency currency={currency} />
          <span className="issuer-separator">&nbsp;</span>
          {tokenData.issuer_name && (
            <div className="token-issuer-wrap">
              <span className="paren">(</span>
              <div className="token-name">
                {tokenData.issuer_name
                  .trim()
                  .toUpperCase()
                  .replace('(', '')
                  .replace(')', '')}
              </div>
              <span className="paren">)</span>
            </div>
          )}
        </div>

        {tokenURL && (
          <a
            className="issuer-ext-link"
            href={
              tokenURL.startsWith('http') ? tokenURL : `https://${tokenURL}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="issuer-ext-link-icon" src="/globe.svg" alt="" />
            <span className="issuer-ext-link-text">
              {tokenURL.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </span>
          </a>
        )}
      </div>
      <div className="section box-content">
        <HeaderBoxes
          xrpUSDRate={xrpUSDRate}
          overviewData={overviewData}
          marketData={marketData}
          isHoldersDataLoading={isHoldersDataLoading}
          isAmmTvlLoading={isAmmTvlLoading}
        />
      </div>
    </div>
  )
}
