import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

import './styles.scss'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../shared/utils'
import {
  truncateString,
  shouldShowLoadingSpinner,
} from '../utils/tokenCalculations'
import { parseAmount, parsePercent } from '../../Tokens/TokensTable'

export interface OverviewData {
  issuer: string
  price: string
  holders: number
  trustlines: number
  transfer_fee: number
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
  isHoldersDataLoading?: boolean
  isAmmTvlLoading?: boolean
}

export const HeaderBoxes = ({
  overviewData,
  marketData,
  xrpUSDRate,
  isHoldersDataLoading,
  isAmmTvlLoading,
}: HeaderBoxesProps): JSX.Element => {
  const { t } = useTranslation()
  const { issuer, price, holders, trustlines, transfer_fee } = overviewData
  const { supply, circ_supply, market_cap, volume_24h, trades_24h, amm_tvl } =
    marketData

  // Memoized calculations for performance
  const marketCalculations = useMemo(() => {
    const circSupplyNum = Number(circ_supply) || 0
    const priceNum = Number(price) || 0
    const xrpRate = Number(xrpUSDRate) || 0

    return {
      formattedCircSupply: parseAmount(circSupplyNum, 2),
      marketCap:
        circSupplyNum && priceNum && xrpRate
          ? `$${parseAmount(circSupplyNum * priceNum * xrpRate, 2)}`
          : null,
    }
  }, [circ_supply, price, xrpUSDRate])

  // Memoized loading states
  const loadingStates = useMemo(
    () => ({
      circSupplyLoading: shouldShowLoadingSpinner(
        isHoldersDataLoading,
        circ_supply,
      ),
      ammTvlLoading: shouldShowLoadingSpinner(isAmmTvlLoading, amm_tvl),
    }),
    [isHoldersDataLoading, circ_supply, isAmmTvlLoading, amm_tvl],
  )

  const formattedPrice = useMemo(() => {
    const normPrice = Number(price) * Number(xrpUSDRate)
    if (normPrice < 0.0001) {
      return '< $0.0001'
    }
    return formatPrice(normPrice)
  }, [price, xrpUSDRate])

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
            <div className="item-value">{formattedPrice}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.holders')}:</div>
            <div className="item-value">{parseAmount(holders)}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.trustlines')}:</div>
            <div className="item-value">{parseAmount(trustlines)}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.transfer_fee')}:</div>
            <div className="item-value">{parsePercent(transfer_fee)}</div>
          </div>
          {/* <div className="header-box-item">
            <div className="item-name">{t('token_page.reputation_level')}:</div>
            <div className="item-value">
              {reputation_level > 0 ? (
                <div className="reputation-level">{reputation_level}</div>
              ) : (
                <div>--</div>
              )}
            </div>
          </div> */}
        </div>
      </div>

      <div className="header-box">
        <div className="header-box-title">{t('token_page.market_data')}</div>
        <div className="header-box-contents">
          <div className="header-box-item">
            <div className="item-name">{t('token_page.supply')}:</div>
            <div className="item-value">{parseAmount(supply, 2)}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">
              {t('token_page.circulating_supply')}:
            </div>
            <div className="item-value">
              {loadingStates.circSupplyLoading ? (
                <span className="loading-spinner" />
              ) : (
                marketCalculations.formattedCircSupply
              )}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.market_cap')}:</div>
            <div className="item-value">
              {loadingStates.circSupplyLoading ? (
                <span className="loading-spinner" />
              ) : (
                marketCalculations.marketCap || '--'
              )}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.volume_24h')}:</div>
            <div className="item-value">
              {Number(volume_24h) > 0
                ? `$${parseAmount(Number(volume_24h) * Number(xrpUSDRate), 2)}`
                : '--'}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.trades_24h')}:</div>
            <div className="item-value">
              {Number(trades_24h) > 0 ? parseAmount(trades_24h) : '--'}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.amm_tvl')}:</div>
            <div className="item-value">
              {loadingStates.ammTvlLoading ? (
                <span className="loading-spinner" />
              ) : (
                `$${parseAmount(amm_tvl, 2)}`
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
