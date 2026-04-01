import { getMPTHolders } from '../../../../rippled/lib/rippled'
import { convertScaledPrice } from '../../../shared/utils'

interface MPTHolderFromClio {
  account: string
  flags: number
  mpt_amount: string
  mptoken_index: string
}

interface MPTHolder {
  rank: number
  account: string
  balance: string
  percent: number
  value_usd: number | null
}
export interface MPTHolderSummary {
  holders: MPTHolder[]
  totalHolders: number
}

export async function fetchAllMPTHolders(
  rippledSocket: any,
  tokenId: string,
  outstandingAmount: string,
  assetScale: number,
): Promise<MPTHolderSummary> {
  const allHolders: MPTHolderFromClio[] = []
  let marker: string | undefined

  do {
    // eslint-disable-next-line no-await-in-loop
    const response = await getMPTHolders(
      rippledSocket,
      tokenId,
      100, // Fetch 100 at a time for efficiency
      marker || '',
    )

    if (response.mptokens) {
      allHolders.push(...response.mptokens)
    }

    marker = response.marker
  } while (marker)

  const totalOutstanding = BigInt(outstandingAmount || '0')

  // Filter out zero balances and sort by balance in descending order
  const sortedHolders = allHolders
    .filter((h) => BigInt(h.mpt_amount || 0) > 0n)
    .sort((a, b) => {
      const diff = BigInt(b.mpt_amount || 0) - BigInt(a.mpt_amount || 0)
      if (diff > 0n) {
        return 1
      }

      if (diff < 0n) {
        return -1
      }

      return 0
    })

  // Format holders with rank and percentage
  const holders: MPTHolder[] = sortedHolders.map(
    (token: MPTHolderFromClio, index: number) => {
      const balance = BigInt(token.mpt_amount || '0')
      const percent =
        totalOutstanding > 0n
          ? Number((balance * 10000n) / totalOutstanding) / 100
          : 0

      return {
        rank: index + 1,
        account: token.account,
        balance: convertScaledPrice(BigInt(token.mpt_amount || 0), assetScale),
        percent,
        value_usd: null, // MPT doesn't have USD value yet
      }
    },
  )

  return {
    holders,
    totalHolders: holders.length,
  }
}
