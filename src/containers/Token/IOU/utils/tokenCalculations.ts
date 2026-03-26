import { parseIntegerAmount } from '../../../shared/NumberFormattingUtils'
import { TokenHoldersData } from '../api/holders'
import { LOSToken } from '../../../shared/losTypes'

/**
 * Calculates the circulating supply for a token
 * @param holdersData - Token holders data
 * @param tokenData - Token data
 * @returns Calculated circulating supply
 */
export const calculateCirculatingSupply = (
  holdersData: TokenHoldersData | undefined,
  tokenData: LOSToken,
): number => {
  if (tokenData.circ_supply) {
    return Number(tokenData.circ_supply)
  }
  let circSupply = Number(tokenData.supply) || holdersData?.totalSupply || 0

  // For stablecoins, don't subtract large percentage holders from circulating supply
  if (tokenData.asset_subclass !== 'stablecoin' && holdersData) {
    holdersData.holders.forEach((holder) => {
      if (holder.percent >= 20) {
        circSupply -= holder.balance
      }
    })
  }

  return circSupply
}

/**
 * Formats the circulating supply for display
 * @param circSupply - The circulating supply number
 * @returns Formatted circulating supply string
 */
export const formatCirculatingSupply = (circSupply: number): string =>
  parseIntegerAmount(circSupply)
