import type { ExplorerXrplClient } from '../shared/SocketContext'

/**
 * Data extracted from a liquidated AMM pool's last transaction metadata.
 * The DeletedNode with LedgerEntryType "AMM" contains the pool's final state.
 */
export interface LiquidatedAMMData {
  account: string
  asset: { currency: string; issuer?: string }
  asset2: { currency: string; issuer?: string }
  lpToken: { currency: string; issuer: string; value: string }
  auctionSlot?: {
    account?: string
    expiration?: number
    price?: { currency: string; issuer?: string; value: string }
  }
  liquidationDate: number // ripple epoch timestamp
}

/**
 * Find the DeletedNode with LedgerEntryType "AMM" in a transaction's metadata.
 */
const findDeletedAMMNode = (meta: any): any | null => {
  if (!meta?.AffectedNodes) return null
  for (const node of meta.AffectedNodes) {
    if (
      node.DeletedNode?.LedgerEntryType === 'AMM' &&
      node.DeletedNode?.FinalFields
    ) {
      return node.DeletedNode.FinalFields
    }
  }
  return null
}

/**
 * Check if a deleted account is a liquidated AMM pool by fetching its last
 * transaction and looking for a DeletedNode with LedgerEntryType "AMM".
 *
 * Returns the extracted AMM data if it's a liquidated pool, or null otherwise.
 */
export const detectLiquidatedAMM = async (
  rippledSocket: ExplorerXrplClient,
  accountId: string,
): Promise<LiquidatedAMMData | null> => {
  const resp = await rippledSocket.send({
    command: 'account_tx',
    account: accountId,
    limit: 1,
    ledger_index_min: -1,
    ledger_index_max: -1,
  })

  const lastTx = resp?.transactions?.[0]
  if (!lastTx) return null

  const ammFields = findDeletedAMMNode(lastTx.meta)
  if (!ammFields) return null

  return {
    account: ammFields.Account ?? accountId,
    asset: ammFields.Asset ?? { currency: 'XRP' },
    asset2: ammFields.Asset2 ?? { currency: 'XRP' },
    lpToken: ammFields.LPTokenBalance ?? {
      currency: '',
      issuer: accountId,
      value: '0',
    },
    auctionSlot: ammFields.AuctionSlot
      ? {
          account: ammFields.AuctionSlot.Account,
          expiration: ammFields.AuctionSlot.Expiration,
          price: ammFields.AuctionSlot.Price,
        }
      : undefined,
    liquidationDate: lastTx.date ?? lastTx.tx?.date,
  }
}
