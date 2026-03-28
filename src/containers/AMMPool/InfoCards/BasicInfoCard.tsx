import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { CopyableText } from '../../shared/components/CopyableText'
import { convertRippleDate } from '../../../rippled/lib/convertRippleDate'
import {
  formatTradingFee,
  shortenAccount,
  shortenLPToken,
} from '../../shared/utils'
import BasicInfoIcon from '../../shared/images/basic_info_icon.svg'

interface BasicInfoCardProps {
  ammAccountId: string
  tradingFee: number
  createdTimestamp: number | null | undefined
  lpTokenCurrency?: string
}

export const BasicInfoCard: FC<BasicInfoCardProps> = ({
  ammAccountId,
  tradingFee,
  createdTimestamp,
  lpTokenCurrency,
}) => {
  const { t } = useTranslation()

  const tradingFeePercent = formatTradingFee(tradingFee)

  const createdDate = createdTimestamp
    ? new Date(convertRippleDate(createdTimestamp)).toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        },
      )
    : '--'

  return (
    <div className="amm-pool-info-card">
      <h3 className="info-card-title">
        <BasicInfoIcon className="info-card-icon" />
        {t('basic_info')}
      </h3>
      <div className="info-card-rows">
        <div className="info-card-row">
          <span className="info-card-label">{t('amm_account_id')}</span>
          <span className="info-card-value info-card-value-link">
            <CopyableText
              text={ammAccountId}
              displayText={shortenAccount(ammAccountId)}
            />
          </span>
        </div>
        {lpTokenCurrency && (
          <div className="info-card-row">
            <span className="info-card-label">
              {t('lp_token_currency_code')}
            </span>
            <span className="info-card-value">
              <CopyableText
                text={lpTokenCurrency}
                displayText={shortenLPToken(lpTokenCurrency)}
              />
            </span>
          </div>
        )}
        <div className="info-card-row">
          <span className="info-card-label">{t('trading_fee')}</span>
          <span className="info-card-value info-card-value-orange">
            {tradingFeePercent}%
          </span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">{t('created_on')}</span>
          <span className="info-card-value">{createdDate}</span>
        </div>
      </div>
    </div>
  )
}
