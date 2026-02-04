import { getMPTHolders } from '../../../../rippled/lib/rippled'
import { XRPLHolder } from '../../../Token/shared/components/HoldersTable/HoldersTable'

interface VaultHolderFromClio {
  account: string
  mpt_amount: string
}

export interface VaultDepositorSummary {
  depositors: XRPLHolder[]
  totalDepositors: number
}

/**
 * Fetches all vault depositors and calculates their share values.
 *
 * @param rippledSocket - The rippled socket connection
 * @param shareMptId - The MPT ID for vault shares
 * @param totalSupply - Total supply of vault shares
 * @param assetsTotal - Total assets in the vault
 * @param tokenToUsdRate - Exchange rate from token to USD
 * @returns Summary with all depositors and total count
 */
export async function fetchAllVaultDepositors(
  rippledSocket: any,
  shareMptId: string,
  totalSupply: string | undefined,
  assetsTotal: string | undefined,
  tokenToUsdRate: number,
): Promise<VaultDepositorSummary> {
  const allHolders: VaultHolderFromClio[] = []
  let marker: string | undefined

  do {
    // eslint-disable-next-line no-await-in-loop
    const response = await getMPTHolders(
      rippledSocket,
      shareMptId,
      100, // Fetch 100 at a time for efficiency
      marker || '',
    )

    if (response.mpt_holders) {
      allHolders.push(...response.mpt_holders)
    }

    marker = response.marker
  } while (marker)

  const totalSupplyNum = totalSupply ? Number(totalSupply) : 0
  const assetsTotalNum = assetsTotal ? Number(assetsTotal) : 0

  // Filter out zero balances and sort by amount in descending order
  const sortedHolders = allHolders
    .filter((h) => Number(h.mpt_amount || 0) > 0)
    .sort((a, b) => Number(b.mpt_amount || 0) - Number(a.mpt_amount || 0))

  // Calculate USD value for a holder's share
  const calculateValueUsd = (holderAmount: string): number | null => {
    const amount = Number(holderAmount)
    if (!totalSupplyNum || !assetsTotalNum) return null

    // Proportional value: (holder tokens / total supply) * total assets
    const value = (amount / totalSupplyNum) * assetsTotalNum

    // Convert to USD
    if (tokenToUsdRate > 0) {
      return value * tokenToUsdRate
    }
    return null
  }

  // Format depositors with rank and percentage
  const depositors: XRPLHolder[] = sortedHolders.map(
    (holder: VaultHolderFromClio, index: number) => {
      const amount = Number(holder.mpt_amount || '0')
      const percent = totalSupplyNum > 0 ? (amount / totalSupplyNum) * 100 : 0

      return {
        rank: index + 1,
        account: holder.account,
        balance: holder.mpt_amount,
        percent,
        value_usd: calculateValueUsd(holder.mpt_amount),
      }
    },
  )

  return {
    depositors,
    totalDepositors: depositors.length,
  }
}
