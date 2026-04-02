import type { ExplorerXrplClient } from '../shared/SocketContext'

/**
 * Data extracted from a deleted AMM pool's last transaction metadata.
 * The DeletedNode with LedgerEntryType "AMM" contains the pool's final state.
 */
export interface DeletedAMMData {
  account: string
  asset: { currency: string; issuer?: string }
  asset2: { currency: string; issuer?: string }
  lpToken: { currency: string; issuer: string; value: string }
  deletionDate: number // ripple epoch timestamp
}

/**
 * Find the DeletedNode with LedgerEntryType "AMM" in a transaction's metadata.
 */
const findDeletedAMMNode = (meta: any): any | null => {
  if (!meta?.AffectedNodes) {
    return null
  }

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
 * Fetch the last transaction of a deleted account and, if it was an AMMWithdraw
 * that removed a DeletedNode with LedgerEntryType "AMM", return the pool's
 * final state.
 *
 * Returns the extracted AMM data if it's a deleted pool, or null otherwise.
 */
export const getDeletedAMMData = async (
  rippledSocket: ExplorerXrplClient,
  accountId: string,
): Promise<DeletedAMMData | null> => {
  const resp = await rippledSocket.send({
    command: 'account_tx',
    account: accountId,
    limit: 1,
  })

  const lastTx = resp?.transactions?.[0]
  if (!lastTx) {
    return null
  }

  if (lastTx.tx?.TransactionType !== 'AMMWithdraw') {
    return null
  }

  const ammFields = findDeletedAMMNode(lastTx.meta)
  if (!ammFields) {
    return null
  }

  return {
    account: ammFields.Account ?? accountId,
    asset: ammFields.Asset ?? { currency: 'XRP' },
    asset2: ammFields.Asset2 ?? { currency: 'XRP' },
    lpToken: ammFields.LPTokenBalance ?? {
      currency: '',
      issuer: accountId,
      value: '0',
    },
    deletionDate: lastTx.date ?? lastTx.tx?.date,
  }
}
