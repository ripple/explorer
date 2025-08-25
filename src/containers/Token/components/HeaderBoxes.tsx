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
    <>
      <div className="header-box">
        <div className="header-box-title">{t('general_overview')}</div>
        <div className="header-box-contents">
          <div className="header-box-item">
            {t('price')}: {price}
          </div>
          <div className="header-box-item">
            {t('holders')}: {holders}
          </div>
          <div className="header-box-item">
            {t('trustlines')}: {trustlines}
          </div>
          <div className="header-box-item">
            {t('transfer_fee')}: {transfer_fee}
          </div>
          <div className="header-box-item">
            {t('reputation_level')}: {reputation_level}
          </div>
        </div>
      </div>

      <div className="header-box">
        <div>{t('market_data')}</div>
        <div className="header-box-contents">
          <div className="header-box-item">
            {t('supply')}: {supply}
          </div>
          <div className="header-box-item">
            {t('circulating_supply')}: {circ_supply}
          </div>
          <div className="header-box-item">
            {t('market_cap')}: {market_cap}
          </div>
          <div className="header-box-item">
            {t('volume_24h')}: {volume_24h}
          </div>
          <div className="header-box-item">
            {t('trades_24h')}: {trades_24h}
          </div>
          <div className="header-box-item">
            {t('amm_tvl')}: {amm_tvl}
          </div>
        </div>
      </div>
    </>
  )
}
