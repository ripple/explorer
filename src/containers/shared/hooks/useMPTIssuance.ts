import { useContext } from 'react'
import { useQuery } from 'react-query'
import SocketContext from '../SocketContext'
import { getMPTIssuance } from '../../../rippled/lib/rippled'
import { formatMPTIssuance } from '../../../rippled/lib/utils'
import { FormattedMPTIssuance } from '../Interfaces'
import { useAnalytics } from '../analytics'

/**
 * Fetches and caches MPT issuance data for a given MPT ID.
 * Returns the formatted issuance data including parsed metadata (ticker, name, etc.).
 *
 * @param mptID - The MPT issuance ID, or null/undefined if not applicable.
 * @param enabled - Whether to enable the query (default: true when mptID is truthy).
 */
export const useMPTIssuance = (
  mptID: string | null | undefined,
  enabled = true,
) => {
  const rippledSocket = useContext(SocketContext)
  const { trackException } = useAnalytics()

  return useQuery<FormattedMPTIssuance>(
    ['getMPTIssuance', mptID],
    async () => {
      const info = await getMPTIssuance(rippledSocket, mptID!)
      return formatMPTIssuance(info.node)
    },
    {
      enabled: enabled && !!mptID,
      onError: (e: any) => {
        trackException(
          `Error fetching mptIssuanceID metadata ${mptID} --- ${JSON.stringify(e)}`,
        )
      },
    },
  )
}

/**
 * Returns the display name for an MPT: ticker symbol if available, otherwise the MPT ID.
 */
export const getMPTDisplayName = (
  mptID: string,
  parsedMPTMetadata?: Record<string, unknown>,
): string => {
  const ticker = parsedMPTMetadata?.ticker as string | undefined
  return ticker || mptID
}
