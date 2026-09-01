// Holders owning at least this percentage of the supply are treated as
// non-circulating (issuer / treasury / whale wallets) and excluded from the
// circulating supply estimate. Shared by the IOU and MPT token pages.
export const LARGE_HOLDER_THRESHOLD_PERCENT = 20

// Asset class (from token metadata) whose large holders — treasuries /
// custodians — are legitimately part of circulating supply, so the large-holder
// exclusion is skipped. Shared by the IOU and MPT token pages. Stablecoins are
// an RWA subclass, so this class check covers them too.
export const RWA_ASSET_CLASS = 'rwa'

/**
 * Whether a holder's share is large enough to be treated as non-circulating.
 *
 * @param percent - The holder's percentage of supply.
 * @returns true when the holder meets the large-holder threshold.
 */
export const isLargeHolder = (percent: number): boolean =>
  percent >= LARGE_HOLDER_THRESHOLD_PERCENT

/**
 * Whether a token's asset class marks it as a real-world asset.
 *
 * Compared case-insensitively: for MPTs this value is free-form JSON authored by
 * the issuer, so `RWA` / ` rwa ` should match too.
 *
 * @param assetClass - The token's asset_class metadata value.
 * @returns true when the token is an RWA.
 */
export const isRwaAssetClass = (assetClass: string | undefined): boolean =>
  assetClass?.trim().toLowerCase() === RWA_ASSET_CLASS

interface HolderShare {
  percent: number
  balance: number
}

/**
 * Subtracts the balances of "large" holders (>= LARGE_HOLDER_THRESHOLD_PERCENT
 * of supply) from a token's total supply to estimate its circulating supply.
 *
 * @param supply - The token's total supply.
 * @param holders - Holder balances with their percentage of supply.
 * @returns The supply with large-holder balances removed.
 */
export const subtractLargeHolderBalances = (
  supply: number,
  holders: readonly HolderShare[] | undefined,
): number =>
  (holders ?? []).reduce(
    (circulating, holder) =>
      isLargeHolder(holder.percent)
        ? circulating - holder.balance
        : circulating,
    supply,
  )

interface IouTokenSupplyData {
  supply?: string
  circ_supply?: string
  asset_class?: string
}

interface IouHoldersData {
  totalSupply: number
  holders: readonly HolderShare[]
}

/**
 * Calculates an IOU token's circulating supply.
 *
 * Uses the reported circulating supply when present; otherwise subtracts large
 * holders from total supply — skipped for RWA tokens, whose large holders are
 * custodial treasuries. Stablecoins are an RWA subclass, so the same
 * `asset_class === 'rwa'` check covers them.
 *
 * @param tokenData - Token supply and asset-classification fields.
 * @param holdersData - Holder balances, used as a supply fallback.
 * @returns The circulating supply.
 */
export const calculateIouCirculatingSupply = (
  tokenData: IouTokenSupplyData,
  holdersData: IouHoldersData | undefined,
): number => {
  if (tokenData.circ_supply) {
    return Number(tokenData.circ_supply)
  }

  const supply = Number(tokenData.supply) || holdersData?.totalSupply || 0

  if (isRwaAssetClass(tokenData.asset_class)) {
    return supply
  }

  return subtractLargeHolderBalances(supply, holdersData?.holders)
}
