import './styles.scss'
import Currency from '../../shared/components/Currency'
import {
  HeaderBoxes,
  MarketData,
  OverviewData,
} from '../components/HeaderBoxes'
import { LOSToken } from '../../shared/losTypes'
import { TokenHoldersData } from '../../../rippled/holders'

interface TokenHeaderProps {
  currency: string
  tokenData: LOSToken
  xrpUSDRate: string
  holdersData?: TokenHoldersData
  isHoldersDataLoading: boolean
  ammTvlData?: number
  isAmmTvlLoading: boolean
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
  let circSupply = holdersData?.totalSupply || Number(tokenData.supply) || 0

  console.log('subclass', tokenData)
  // For stablecoins, don't subtract large percentage holders from circulating supply
  if (tokenData.asset_subclass !== 'stablecoin') {
    let i = 0
    while (holdersData && holdersData.holders[i].percent >= 20) {
      circSupply -= holdersData.holders[i].balance
      i += 1
    }
  }
  const overviewData: OverviewData = {
    issuer: tokenData.issuer_name || tokenData.issuer_account,
    price: tokenData.price || '---',
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

  const tokenLogo =
    tokenData.icon || 'https://s1.xrplmeta.org/icon/03DDEF3C9D.png'
  const tokenURL = tokenData.issuer_domain || `https://bitstamp.net`
  return (
    <div className="box token-header">
      <div className="section token-indicator">
        <div className="token-label">Token</div>
        <div className="category-pill">
          <div className="category-text">IOU</div>
        </div>
      </div>
      <div className="section box-header">
        <div className="token-info-group">
          {tokenLogo && (
            <img
              className="token-logo"
              alt={`${currency} logo`}
              src={tokenLogo}
            />
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
