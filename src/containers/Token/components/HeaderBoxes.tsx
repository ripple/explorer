import { useTranslation } from 'react-i18next'

import './styles.scss'

export interface OverviewData {
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
  const { price, holders, trustlines, transfer_fee, reputation_level } =
    overviewData
  const { supply, circ_supply, market_cap, volume_24h, trades_24h, amm_tvl } =
    marketData

  return (
    <div className="header-boxes">
      <div className="header-box">
        <div className="header-box-title">
          {t('token_page.general_overview')}
        </div>
        <div className="header-box-contents">
          <div className="header-box-item">
            {t('token_page.price')}: {price}
          </div>
          <div className="header-box-item">
            {t('token_page.holders')}: {holders}
          </div>
          <div className="header-box-item">
            {t('token_page.trustlines')}: {trustlines}
          </div>
          <div className="header-box-item">
            {t('token_page.transfer_fee')}: {transfer_fee}
          </div>
          <div className="header-box-item">
            {t('token_page.reputation_level')}: {reputation_level}
          </div>
        </div>
      </div>

      <div className="header-box">
        <div className="header-box-title">{t('token_page.market_data')}</div>
        <div className="header-box-contents">
          <div className="header-box-item">
            {t('token_page.supply')}: {supply}
          </div>
          <div className="header-box-item">
            {t('token_page.circulating_supply')}: {circ_supply}
          </div>
          <div className="header-box-item">
            {t('token_page.market_cap')}: {market_cap}
          </div>
          <div className="header-box-item">
            {t('token_page.volume_24h')}: {volume_24h}
          </div>
          <div className="header-box-item">
            {t('token_page.trades_24h')}: {trades_24h}
          </div>
          <div className="header-box-item">
            {t('token_page.amm_tvl')}: {amm_tvl}
          </div>
        </div>
      </div>
    </div>
  )
}
