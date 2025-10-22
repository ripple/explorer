import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

import './styles.scss'
import { Link } from 'react-router-dom'
import { formatPrice, shortenAccount } from '../../shared/utils'
import { shouldShowLoadingSpinner } from '../utils/tokenCalculations'
import { truncateString } from '../utils/stringFormatting'
import { DEFAULT_EMPTY_VALUE } from '../utils/numberFormatting'
import { parseAmount, parsePercent } from '../../shared/NumberFormattingUtils'
import { Account } from '../../shared/components/Account'

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
  isHoldersDataLoading = false,
  isAmmTvlLoading = false,
}: HeaderBoxesProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    issuer,
    price,
    holders,
    trustlines,
    transfer_fee: transferFee,
  } = overviewData
  const {
    supply,
    circ_supply: circSupply,
    volume_24h: volume24h,
    trades_24h: trades24h,
    amm_tvl: ammTvl,
  } = marketData

  // Memoized calculations for performance
  const marketCalculations = useMemo(() => {
    const circSupplyNum = Number(circSupply) || 0
    const priceNum = Number(price) || 0
    const xrpRate = Number(xrpUSDRate) || 0

    return {
      formattedCircSupply: parseAmount(circSupplyNum, 2),
      marketCap:
        circSupplyNum && priceNum && xrpRate
          ? `$${parseAmount(circSupplyNum * priceNum * xrpRate, 2)}`
          : null,
    }
  }, [circSupply, price, xrpUSDRate])

  // Memoized loading states
  const loadingStates = useMemo(
    () => ({
      circSupplyLoading: shouldShowLoadingSpinner(
        isHoldersDataLoading,
        circSupply,
      ),
      ammTvlLoading: shouldShowLoadingSpinner(isAmmTvlLoading, ammTvl),
    }),
    [isHoldersDataLoading, circSupply, isAmmTvlLoading, ammTvl],
  )

  const formattedPrice = useMemo(() => {
    const normPrice = Number(price) * Number(xrpUSDRate)
    if (normPrice === 0) {
      return DEFAULT_EMPTY_VALUE
    }
    if (normPrice < 0.0001) {
      return '< $0.0001'
    }
    return formatPrice(normPrice)
  }, [price, xrpUSDRate, t])

  return (
    <div className="header-boxes">
      <div className="header-box">
        <div className="header-box-title">
          {t('token_page.general_overview')}
        </div>
        <div className="header-box-contents">
          <div className="header-box-item">
            <div className="item-name">{t('token_page.issuer')}:</div>
            <div className="item-value account-link">
              <Account account={issuer} displayText={shortenAccount(issuer)} />
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.price')}:</div>
            <div className="item-value">{formattedPrice}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.holders')}:</div>
            <div className="item-value">
              {holders > 0 ? parseAmount(holders) : DEFAULT_EMPTY_VALUE}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.trustlines')}:</div>
            <div className="item-value">
              {trustlines > 0 ? parseAmount(trustlines) : DEFAULT_EMPTY_VALUE}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.transfer_fee')}:</div>
            <div className="item-value">
              {transferFee > 0
                ? parsePercent(transferFee)
                : DEFAULT_EMPTY_VALUE}
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
              {Number(supply) > 0
                ? parseAmount(supply, 2)
                : DEFAULT_EMPTY_VALUE}
            </div>
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
                marketCalculations.marketCap || DEFAULT_EMPTY_VALUE
              )}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.volume_24h')}:</div>
            <div className="item-value">
              {Number(volume24h) > 0
                ? `$${parseAmount(Number(volume24h) * Number(xrpUSDRate), 2)}`
                : DEFAULT_EMPTY_VALUE}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.trades_24h')}:</div>
            <div className="item-value">
              {Number(trades24h) > 0
                ? parseAmount(trades24h)
                : DEFAULT_EMPTY_VALUE}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.amm_tvl')}:</div>
            <div className="item-value">
              {loadingStates.ammTvlLoading ? (
                <span className="loading-spinner" />
              ) : (
                `$${parseAmount(ammTvl, 2)}`
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
