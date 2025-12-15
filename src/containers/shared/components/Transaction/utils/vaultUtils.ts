import { getVault, getLoanBroker } from '../../../../../rippled/lib/rippled'
import { formatAsset } from '../../../../../rippled/lib/txSummary/formatAmount'

/**
 * Fetches Vault information and returns the Asset field
 * @param rippledSocket - The rippled WebSocket connection
 * @param vaultId - The VaultID to fetch
 * @returns Promise<Asset> - The Asset field from the Vault object
 */
export async function getVaultAsset(rippledSocket: any, vaultId: string) {
  try {
    const vault = await getVault(rippledSocket, vaultId)
    return formatAsset(vault.Asset)
  } catch (error) {
    // Return XRP as fallback to maintain backward compatibility
    return { currency: 'XRP' }
  }
}

/**
 * Fetches LoanBroker information, then Vault information, and returns the Asset field
 * @param rippledSocket - The rippled WebSocket connection
 * @param loanBrokerId - The LoanBrokerID to fetch
 * @returns Promise<Asset> - The Asset field from the associated Vault object
 */
export async function getVaultAssetFromLoanBroker(
  rippledSocket: any,
  loanBrokerId: string,
) {
  try {
    const loanBroker = await getLoanBroker(rippledSocket, loanBrokerId)
    const vaultId = loanBroker.VaultID

    if (!vaultId) {
      throw new Error('LoanBroker does not have a VaultID')
    }

    return await getVaultAsset(rippledSocket, vaultId)
  } catch (error) {
    // Return XRP as fallback to maintain backward compatibility
    return { currency: 'XRP' }
  }
}
