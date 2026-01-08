import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import './styles.scss'
import Currency from '../../../shared/components/Currency'
import {
  HeaderBoxes,
  MarketData,
  OverviewData,
} from '../components/HeaderBoxes'
import { LOSToken } from '../../../shared/losTypes'
import { TokenHoldersData } from '../api/holders'
import DomainLink from '../../../shared/components/DomainLink'
import GlobeSvg from '../../../shared/images/globe.svg'
import {
  parseAmount,
  parseCurrencyAmount,
  parseIntegerAmount,
  parsePercent,
  parsePrice,
} from '../../../shared/NumberFormattingUtils'
import { shortenDomain, stripHttpProtocol } from '../../../shared/utils'

interface HeaderProps {
  currency: string
  tokenData: LOSToken
  xrpUSDRate: string
  holdersData?: TokenHoldersData
  isHoldersDataLoading: boolean
  ammTvlData?: { tvl: number; account: string }
  isAmmTvlLoading: boolean
}

const calculateCirculatingSupply = (
  tokenData: LOSToken,
  holdersData: TokenHoldersData | undefined,
): number => {
  if (tokenData.circ_supply) {
    return Number(tokenData.circ_supply)
  }
  let circSupply = Number(tokenData.supply) || holdersData?.totalSupply || 0

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

export const Header = ({
  currency,
  tokenData,
  xrpUSDRate,
  holdersData,
  isHoldersDataLoading,
  ammTvlData,
  isAmmTvlLoading,
}: HeaderProps) => {
  const { t } = useTranslation()
  const circSupply = calculateCirculatingSupply(tokenData, holdersData)
  const xrpRate = Number(xrpUSDRate) || 0

  // Memoized formatted overview data
  const overviewData: OverviewData = useMemo(() => {
    const priceNum = Number(tokenData.price) || 0
    const normPrice = priceNum * xrpRate
    const formattedPrice = parsePrice(normPrice)
    const formattedHolders = parseIntegerAmount(tokenData.holders || 0)
    const formattedTrustlines = parseIntegerAmount(tokenData.trustlines || 0)
    const formattedTransferFee =
      parsePercent(tokenData.transfer_fee || 0) !== '0.00%'
        ? parsePercent(tokenData.transfer_fee || 0)
        : '--'

    return {
      issuer: tokenData.issuer_name || tokenData.issuer_account,
      issuer_account: tokenData.issuer_account,
      price: formattedPrice,
      holders: formattedHolders,
      trustlines: formattedTrustlines,
      transfer_fee: formattedTransferFee,
    }
  }, [tokenData, xrpRate])

  // Memoized formatted market data
  const marketData: MarketData = useMemo(() => {
    const circSupplyNum = Number(circSupply) || 0
    const priceNum = Number(tokenData.price) || 0
    const volume24hNum = Number(tokenData.daily_volume) || 0
    const trades24hNum = Number(tokenData.daily_trades) || 0

    // Format supply values
    const formattedSupply = parseAmount(
      holdersData?.totalSupply?.toString() || tokenData.supply || '0',
    )
    const formattedCircSupply = parseAmount(circSupplyNum)

    // Calculate market cap
    let marketCap: string | null = null
    if (tokenData.market_cap_usd) {
      marketCap = parseCurrencyAmount(tokenData.market_cap_usd)
    } else if (circSupplyNum && priceNum && xrpRate) {
      marketCap = parseCurrencyAmount(circSupplyNum * priceNum * xrpRate)
    }

    // Format volume and trades
    const parsedVolume = parseCurrencyAmount(volume24hNum * xrpRate)
    const formattedVolume = parsedVolume !== '$0.00' ? parsedVolume : '--'
    const formattedTrades =
      parseIntegerAmount(trades24hNum) !== '0'
        ? parseIntegerAmount(trades24hNum)
        : '--'

    // Format AMM TVL
    const formattedAmmTvl = ammTvlData?.tvl
      ? parseCurrencyAmount(ammTvlData.tvl)
      : ''
    const formattedTvlUsd = tokenData.tvl_usd
      ? parseCurrencyAmount(tokenData.tvl_usd)
      : ''

    return {
      supply: formattedSupply,
      circ_supply: formattedCircSupply,
      market_cap: marketCap || '',
      market_cap_usd: tokenData.market_cap_usd,
      volume_24h: formattedVolume,
      trades_24h: formattedTrades,
      amm_tvl: formattedAmmTvl,
      amm_account: ammTvlData?.account || '',
      tvl_usd: formattedTvlUsd,
    }
  }, [circSupply, tokenData, xrpRate, ammTvlData, holdersData])

  return (
    <div className="box token-header iou">
      <div className="section token-indicator">
        <div className="token-label">{t('token')}</div>
        <div className="category-pill">
          <div className="category-text">{t('token_type.iou')}</div>
        </div>
      </div>
      <div className="section box-header">
        <div className="token-info-group">
          {tokenData.icon ? (
            <img
              className="token-logo"
              alt={`${currency} logo`}
              src={tokenData.icon}
            />
          ) : (
            <div className="token-logo no-logo" />
          )}
          <Currency currency={currency} />
          {tokenData.issuer_name && (
            <div className="token-issuer-wrap">
              <span className="issuer-name">
                (
                {tokenData.issuer_name
                  .trim()
                  .toUpperCase()
                  .replace(/\(/g, '')
                  .replace(/\)/g, '')}
                )
              </span>
            </div>
          )}
        </div>

        {tokenData.issuer_domain && (
          <div className="header-actions">
            <div className="domain-link-container">
              <GlobeSvg className="domain-link-icon" />
              <DomainLink
                className="domain-link"
                domain={tokenData.issuer_domain}
                displayDomain={shortenDomain(
                  stripHttpProtocol(tokenData.issuer_domain),
                  12,
                  7,
                )}
              />
            </div>
          </div>
        )}
      </div>
      <div className="section box-content">
        <HeaderBoxes
          overviewData={overviewData}
          marketData={marketData}
          isHoldersDataLoading={isHoldersDataLoading}
          isAmmTvlLoading={isAmmTvlLoading}
        />
      </div>
    </div>
  )
}
