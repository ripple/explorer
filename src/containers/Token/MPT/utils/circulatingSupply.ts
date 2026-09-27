import { convertScaledPrice } from '../../../shared/utils'
import { isLargeHolder } from '../../shared/utils/circulatingSupply'

interface MptHolderShare {
  percent: number
  // Unscaled on-chain amount.
  rawBalance: string
}

/**
 * Calculates an MPToken's circulating supply: the on-chain outstanding amount
 * with the balances of large (>= 20%) holders removed.
 *
 * For RWA tokens the large holders are typically custodians/treasuries whose
 * balances are still legitimately part of supply, so the exclusion is skipped —
 * the same rule the IOU page uses. RWA is detected from the on-chain
 * `asset_class` metadata; stablecoins are an RWA subclass, so this class check
 * covers them too.
 *
 * @param outstandingAmt - Raw (unscaled) on-chain OutstandingAmount.
 * @param assetScale - The issuance's asset scale.
 * @param holders - Holders with their unscaled `rawBalance` and `percent`.
 * @param isRwa - Whether the token's asset_class is 'rwa' (skip the exclusion).
 * @returns The circulating supply as a scaled decimal string.
 */
export const calculateMptCirculatingSupply = (
  outstandingAmt: string | undefined,
  assetScale: number,
  holders: readonly MptHolderShare[] | undefined,
  isRwa: boolean,
): string => {
  const outstanding = BigInt(outstandingAmt || '0')
  const circulating = isRwa
    ? outstanding
    : (holders ?? []).reduce(
        (remaining, holder) =>
          isLargeHolder(holder.percent)
            ? remaining - BigInt(holder.rawBalance || '0')
            : remaining,
        outstanding,
      )

  return convertScaledPrice(circulating < 0n ? 0n : circulating, assetScale)
}
