import { useTranslation } from 'react-i18next'

import { shortenAccount } from '../../../shared/utils'
import { Account } from '../../../shared/components/Account'

export interface OverviewData {
  issuer: string
  issuer_account: string
  price: string // Pre-formatted price string
  holders: string // Pre-formatted holders count
  trustlines: string // Pre-formatted trustlines count
  transfer_fee: string // Pre-formatted transfer fee or '--'
}

export interface MarketData {
  supply: string // Pre-formatted supply
  circ_supply: string // Pre-formatted circulating supply
  market_cap: string // Pre-formatted market cap or empty string
  market_cap_usd?: string // Raw USD value (for reference)
  volume_24h: string // Pre-formatted volume or '--'
  trades_24h: string // Pre-formatted trades count or '--'
  amm_tvl: string // Pre-formatted AMM TVL or empty string
  amm_account: string // AMM account address
  tvl_usd?: string // Pre-formatted TVL USD or empty string
}

interface HeaderBoxesProps {
  overviewData: OverviewData
  marketData: MarketData
  isHoldersDataLoading?: boolean
  isAmmTvlLoading?: boolean
}

export const HeaderBoxes = ({
  overviewData,
  marketData,
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
    tvl_usd: tvlUsd,
  } = marketData

  const shouldShowAccountLink = !!(tvlUsd || ammTvl) && ammAccount

  return (
    <div className="header-boxes">
      <div className="header-box">
        <div className="header-box-title">
          {t('token_page.general_overview')}
        </div>
        <div className="header-box-contents">
          <div className="header-box-item">
            <div className="item-name">{t('token_page.issuer')}</div>
            <div className="item-value account-link">
              <Account
                account={issuerAccount}
                displayText={shortenAccount(issuer)}
              />
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.price')}</div>
            <div className="item-value">{price}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.holders')}</div>
            <div className="item-value">{holders}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.trustlines')}</div>
            <div className="item-value">{trustlines}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.transfer_fee')}</div>
            <div className="item-value">{transferFee}</div>
          </div>
        </div>
      </div>

      <div className="header-box">
        <div className="header-box-title">{t('token_page.market_data')}</div>
        <div className="header-box-contents">
          <div className="header-box-item">
            <div className="item-name">{t('token_page.supply')}</div>
            <div className="item-value">{supply}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">
              {t('token_page.circulating_supply')}
            </div>
            <div className="item-value">
              {isHoldersDataLoading ? (
                <span className="loading-spinner" />
              ) : (
                circSupply
              )}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.market_cap')}</div>
            <div className="item-value">
              {isHoldersDataLoading ? (
                <span className="loading-spinner" />
              ) : (
                marketData.market_cap
              )}
            </div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.volume_24h')}</div>
            <div className="item-value">{volume24h}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.trades_24h')}</div>
            <div className="item-value">{trades24h}</div>
          </div>
          <div className="header-box-item">
            <div className="item-name">{t('token_page.amm_tvl')}</div>
            <div className="item-value">
              {isAmmTvlLoading && <span className="loading-spinner" />}
              {!isAmmTvlLoading &&
                (shouldShowAccountLink ? (
                  <Account
                    account={ammAccount}
                    displayText={tvlUsd || ammTvl}
                  />
                ) : (
                  '--'
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
