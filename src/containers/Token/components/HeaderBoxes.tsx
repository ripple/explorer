import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

import './styles.scss'
import { shortenAccount } from '../../shared/utils'
import {
  parseAmount,
  parseCurrencyAmount,
  parseIntegerAmount,
  parsePercent,
  parsePrice,
} from '../../shared/NumberFormattingUtils'
import { Account } from '../../shared/components/Account'

export interface OverviewData {
  issuer: string
  issuer_account: string
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
  amm_account: string
}

interface HeaderBoxesProps {
  overviewData: OverviewData
  marketData: MarketData
  xrpUSDRate: string
  isHoldersDataLoading?: boolean
  isAmmTvlLoading?: boolean
}

/**
 * Determines if a loading spinner should be displayed for market data
 * Shows spinner if data is loading or if the value is empty/falsy
 * @param isLoading - Whether data is currently loading
 * @param value - The data value to check
 * @returns true if spinner should be shown, false otherwise
 */
const shouldShowLoadingSpinner = (
  isLoading: boolean | undefined,
  value: string | number | undefined,
): boolean => !!isLoading || !value || value === ''

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
    issuer_account: issuerAccount,
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
    amm_account: ammAccount,
  } = marketData

  // Memoized calculations for performance
  const marketCalculations = useMemo(() => {
    const circSupplyNum = Number(circSupply) || 0
    const priceNum = Number(price) || 0
    const xrpRate = Number(xrpUSDRate) || 0
    const parsedVolume = parseCurrencyAmount(
      Number(volume24h) * Number(xrpUSDRate),
    )

    return {
      formattedCircSupply: parseAmount(circSupplyNum, 2),
      marketCap:
        circSupplyNum && priceNum && xrpRate
          ? parseCurrencyAmount(circSupplyNum * priceNum * xrpRate)
          : null,
      parsedVolume,
    }
  }, [circSupply, price, volume24h, xrpUSDRate])

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
    return parsePrice(normPrice)
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
            <div className="item-value account-link">
              <Account
                account={issuerAccount}
                displayText={shortenAccount(issuer)}
              />
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.price')}:</div>
            <div className="item-value">{formattedPrice}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.holders')}:</div>
            <div className="item-value">{parseIntegerAmount(holders)}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.trustlines')}:</div>
            <div className="item-value">{parseIntegerAmount(trustlines)}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.transfer_fee')}:</div>
            <div className="item-value">
              {parsePercent(transferFee) !== '0.00%'
                ? parsePercent(transferFee)
                : '--'}
            </div>
          </div>
        </div>
      </div>

      <div className="header-box">
        <div className="header-box-title">{t('token_page.market_data')}</div>
        <div className="header-box-contents">
          <div className="header-box-item">
            <div className="item-name">{t('token_page.supply')}:</div>
            <div className="item-value">{parseAmount(supply)}</div>
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
                marketCalculations.marketCap
              )}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.volume_24h')}:</div>
            <div className="item-value">
              {marketCalculations.parsedVolume !== '$0.00'
                ? marketCalculations.parsedVolume
                : '--'}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.trades_24h')}:</div>
            <div className="item-value">
              {parseIntegerAmount(trades24h) !== '0'
                ? parseIntegerAmount(trades24h)
                : '--'}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.amm_tvl')}:</div>
            <div className="item-value">
              {loadingStates.ammTvlLoading ? (
                <span className="loading-spinner" />
              ) : (
                <Account
                  account={ammAccount}
                  displayText={parseCurrencyAmount(ammTvl)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
