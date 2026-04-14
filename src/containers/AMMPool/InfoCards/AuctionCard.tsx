import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Account } from '../../shared/components/Account'
import {
  shortenAccount,
  formatTradingFee,
  localizeDate,
  DATE_OPTIONS_NUMERIC,
} from '../../shared/utils'
import {
  parseAmount,
  parseCurrencyAmount,
} from '../../shared/NumberFormattingUtils'
import AuctionIcon from '../../shared/images/auction_icon.svg'
import { AuctionSlot } from '../types'

interface AuctionCardProps {
  auctionSlot?: AuctionSlot
  tvlUsd?: number
  lpTokenBalance?: string
  tradingFee: number
}

/**
 * Calculate the minimum bid to replace the current auction slot holder.
 *
 * From XRPL docs (AMMBid - Auction Slot Price):
 *
 * Minimum bid (M): M = L * F / 25
 *   L = total LP tokens issued, F = trading fee as decimal
 *
 * Empty/expired/last interval: P = M
 *
 * First interval (time_interval=0): P = B * 1.05 + M
 *
 * Otherwise: P = B * 1.05 * (1 - t^60) + M
 *   B = current bid price in LP tokens
 *   t = fraction of time elapsed, rounded down to multiples of 0.05
 *       (time_interval / 20, where time_interval is 0-19)
 */
const calcReplacementCost = (
  auctionSlot: AuctionSlot | undefined,
  lpTokenBalance: string | undefined,
  tradingFee: number,
): number | null => {
  if (!lpTokenBalance) {
    return null
  }

  const fee = tradingFee / 100000
  const M = (Number(lpTokenBalance) * fee) / 25

  const hasHolder = !!auctionSlot?.account
  // time_interval: 0-19 = active intervals, 20 = expired
  const interval = auctionSlot?.time_interval ?? 20

  // Empty, expired (20), or last interval (19): just the minimum bid
  if (!hasHolder || interval >= 19) {
    return M
  }

  const B = Number(auctionSlot?.price?.value ?? 0)

  // First interval: B * 1.05 + M
  if (interval === 0) {
    return B * 1.05 + M
  }

  // Otherwise: B * 1.05 * (1 - t^60) + M
  const t = interval / 20
  return B * 1.05 * (1 - t ** 60) + M
}

export const AuctionCard: FC<AuctionCardProps> = ({
  auctionSlot,
  tvlUsd,
  lpTokenBalance,
  tradingFee,
}) => {
  const { t } = useTranslation()

  const hasAuctionData = !!auctionSlot?.account

  const discountedFee = hasAuctionData
    ? `${formatTradingFee(auctionSlot?.discounted_fee ?? 0)}%`
    : '--'

  const getLPTokenUSD = (lpValue: number | string | undefined) => {
    if (lpValue == null) {
      return null
    }
    const num = Number(lpValue)
    if (num === 0) {
      return 0
    }
    if (!lpTokenBalance || tvlUsd == null) {
      return null
    }
    return (num / Number(lpTokenBalance)) * tvlUsd
  }

  // Price Paid: directly from amm_info auction_slot.price
  const pricePaidLP =
    hasAuctionData && auctionSlot?.price
      ? parseAmount(auctionSlot.price.value)
      : null
  const pricePaidUSD =
    hasAuctionData && auctionSlot?.price
      ? getLPTokenUSD(auctionSlot.price.value)
      : null

  // Replacement Cost: formula-based on slot state and time_interval
  const replacementCostRaw = calcReplacementCost(
    auctionSlot,
    lpTokenBalance,
    tradingFee,
  )
  const replacementLP =
    replacementCostRaw != null ? replacementCostRaw.toFixed(4) : null
  const replacementUSD =
    replacementCostRaw != null ? getLPTokenUSD(replacementCostRaw) : null

  return (
    <div className="amm-pool-info-card">
      <h3 className="info-card-title">
        <AuctionIcon className="info-card-icon" />
        {t('auction')}
      </h3>
      <div className="info-card-rows">
        <div className="info-card-row">
          <span className="info-card-label">{t('current_holder')}</span>
          <span className="info-card-value info-card-value-link">
            {hasAuctionData && auctionSlot?.account ? (
              <Account
                account={auctionSlot.account}
                displayText={shortenAccount(auctionSlot.account)}
              />
            ) : (
              '--'
            )}
          </span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">{t('expiration')}</span>
          <span className="info-card-value">
            {auctionSlot?.expiration
              ? localizeDate(
                  new Date(auctionSlot.expiration),
                  'en-US',
                  DATE_OPTIONS_NUMERIC,
                )
              : '--'}
          </span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">{t('discounted_fee')}</span>
          <span className="info-card-value info-card-value-orange">
            {discountedFee}
          </span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">{t('price_paid')}</span>
          <span className="info-card-value">
            {pricePaidLP ? (
              <>
                <div>
                  {pricePaidLP} {t('lp_tokens')}
                </div>
                {pricePaidUSD != null && (
                  <div className="info-card-subtitle">
                    &asymp; {parseCurrencyAmount(pricePaidUSD)}
                  </div>
                )}
              </>
            ) : (
              '--'
            )}
          </span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">{t('replacement_cost')}</span>
          <span className="info-card-value">
            {replacementLP ? (
              <>
                <div>
                  {parseAmount(replacementLP)} {t('lp_tokens')}
                </div>
                {replacementUSD != null && (
                  <div className="info-card-subtitle">
                    &asymp; {parseCurrencyAmount(replacementUSD)}
                  </div>
                )}
              </>
            ) : (
              '--'
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
