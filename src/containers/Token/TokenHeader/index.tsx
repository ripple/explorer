import { useTranslation } from 'react-i18next'
import './styles.scss'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { localizeNumber, formatLargeNumber } from '../../shared/utils'
import Currency from '../../shared/components/Currency'
import { Account } from '../../shared/components/Account'
import DomainLink from '../../shared/components/DomainLink'
import { TokenTableRow } from '../../shared/components/TokenTableRow'
import { useLanguage } from '../../shared/hooks'
import { LEDGER_ROUTE, TRANSACTION_ROUTE } from '../../App/routes'
import { RouteLink } from '../../shared/routing'
import { TokenData } from '../../../rippled/token'
import { XRP_BASE } from '../../shared/transactionUtils'
import {
  HeaderBoxes,
  MarketData,
  OverviewData,
} from '../components/HeaderBoxes'
import { LOSToken } from '../../shared/losTypes'
import { TokenHoldersData } from '../../../rippled/holders'

const CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'XRP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
}

interface TokenHeaderProps {
  accountId: string
  currency: string
  tokenData: LOSToken
  xrpUSDRate: string
  holdersData?: TokenHoldersData
  isHoldersDataLoading: boolean
  ammTvlData?: number
  isAmmTvlLoading: boolean
}

export const TokenHeader = ({
  accountId,
  currency,
  tokenData,
  xrpUSDRate,
  holdersData,
  isHoldersDataLoading,
  ammTvlData,
  isAmmTvlLoading,
}: TokenHeaderProps) => {
  const language = useLanguage()
  const { t } = useTranslation()

  console.log('Token data:', tokenData)

  console.log('Holders data:', holdersData)

  console.log('AMM TVL data:', ammTvlData)

  let circSupply = holdersData?.totalSupply || Number(tokenData.supply) || 0
  let i = 0
  while (holdersData && holdersData.holders[i].percent >= 20) {
    circSupply -= holdersData.holders[i].balance
    i += 1
  }
  const overviewData: OverviewData = {
    issuer: tokenData.issuer_name || tokenData.issuer_account,
    price: tokenData.price || '---',
    holders: tokenData.holders || 0,
    trustlines: tokenData.trustlines || 0,
    transfer_fee: tokenData.transfer_fee || 0,
    reputation_level: 3,
  }

  const marketData: MarketData = {
    supply: holdersData?.totalSupply.toString() || tokenData.supply || '',
    circ_supply: circSupply.toString() || tokenData.circ_supply || '',
    market_cap: tokenData.market_cap || '',
    volume_24h: tokenData.daily_volume || '',
    trades_24h: tokenData.daily_trades || '',
    amm_tvl: ammTvlData?.toString() || 'n/a',
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

        {tokenURL && (
          <div className="issuer-ext-link">
            <img className="issuer-ext-link-icon" src="/globe.svg" alt="" />
            <DomainLink domain={tokenURL} keepProtocol={false} />
          </div>
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
