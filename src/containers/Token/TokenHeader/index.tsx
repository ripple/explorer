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
  data: LOSToken
  xrpUSDRate: string
  holdersData?: TokenHoldersData
  isHoldersDataLoading: boolean
}

export const TokenHeader = ({
  accountId,
  currency,
  data,
  xrpUSDRate,
  holdersData,
  isHoldersDataLoading,
}: TokenHeaderProps) => {
  const language = useLanguage()
  const { t } = useTranslation()

  console.log('Token data:', data)

  const overviewData: OverviewData = {
    issuer: data.issuer_name || data.issuer_account,
    price: data.price || '---',
    holders: data.holders || 0,
    trustlines: data.trustlines || 0,
    transfer_fee: data.transfer_fee || 0,
    reputation_level: 3,
  }

  const marketData: MarketData = {
    supply: data.supply || '',
    circ_supply: data.circ_supply || '',
    market_cap: data.market_cap || '',
    volume_24h: data.daily_volume || '',
    trades_24h: data.daily_trades || '',
    amm_tvl: '$0.00',
  }

  const tokenLogo = data.icon || 'https://s1.xrplmeta.org/icon/03DDEF3C9D.png'
  const tokenURL = data.issuer_domain || `https://bitstamp.net`
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
        {data.issuer_name && (
          <div className="token-issuer-wrap">
            <span className="paren">(</span>
            <div className="token-name">
              {data.issuer_name
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
            <img className="issuer-ext-link-icon" src="/globe.svg" />
            <DomainLink domain={tokenURL} keepProtocol={false} />
          </div>
        )}
      </div>
      <div className="section box-content">
        <HeaderBoxes
          xrpUSDRate={xrpUSDRate}
          overviewData={overviewData}
          marketData={marketData}
        />
      </div>
    </div>
  )
}
