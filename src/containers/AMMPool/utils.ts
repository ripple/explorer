import type { ExplorerXrplClient } from '../shared/SocketContext'
import { getAccountTransactions } from '../../rippled/lib/rippled'
import { AMMDepositWithdrawFormatted, LOSAMMDepositWithdrawRaw } from './types'

/**
 * Data extracted from a liquidated AMM pool's last transaction metadata.
 * The DeletedNode with LedgerEntryType "AMM" contains the pool's final state.
 */
export interface LiquidatedAMMData {
  account: string
  asset: { currency: string; issuer?: string }
  asset2: { currency: string; issuer?: string }
  lpToken: { currency: string; issuer: string; value: string }
  liquidationDate: number // ripple epoch timestamp
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
 * Returns the extracted AMM data if it's a liquidated pool, or null otherwise.
 */
export const detectLiquidatedAMM = async (
  rippledSocket: ExplorerXrplClient,
  accountId: string,
): Promise<LiquidatedAMMData | null> => {
  const resp = await getAccountTransactions(rippledSocket, accountId, 1, '')

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
    liquidationDate: lastTx.date ?? lastTx.tx?.date,
  }
}

/**
 * Format AMMDeposit/AMMWithdraw from LOS /v2/transactions response.
 * Preserves the asset order from the transaction data.
 */
export const formatDepositWithdraw = (
  tx: LOSAMMDepositWithdrawRaw,
): AMMDepositWithdrawFormatted => {
  const formatAsset = (
    raw:
      | { currency: string; issuer?: string | null; value: string }
      | undefined,
  ) => {
    if (!raw || Number(raw.value) === 0) {
      return null
    }
    return {
      currency: raw.currency,
      issuer: raw.issuer ?? undefined,
      amount: Number(raw.value),
    }
  }

  return {
    hash: tx.hash,
    ledger: tx.ledger_index,
    timestamp: tx.timestamp,
    account: tx.account,
    asset: formatAsset(tx.amm?.asset1),
    asset2: formatAsset(tx.amm?.asset2),
    lpTokens: tx.amm?.lp_tokens_received ?? tx.amm?.lp_tokens_redeemed ?? null,
    valueUsd: tx.amm?.value_usd ?? null,
  }
}
