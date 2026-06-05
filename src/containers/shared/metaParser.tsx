import type { BaseTransaction } from 'xrpl'
import { XRP_BASE } from './transactionUtils'
import { ExplorerAmount } from './types'

export const LedgerEntryTypes = {
  AccountRoot: 'AccountRoot',
  RippledState: 'RippleState',
  MPToken: 'MPToken',
  AMM: 'AMM',
}
// TODO: fix fee logic - filter out the fee only nodes - make sure fee isnt included in xrp deposits/withdraws

export function getAuthAccounts(tx: any) {
  return tx.AuthAccounts?.map((acc: any) => acc?.AuthAccount?.Account)
}

/*
Gets the AMM account ID
 */
export function getAMMAccountID(meta: any) {
  const account = findNodes(meta, LedgerEntryTypes.AMM)[0]

  if (account) return account.FinalFields?.Account || account.NewFields?.Account

  return undefined
}

export function getLPTokenAmount(meta: any) {
  const lpNode = findNodes(meta, LedgerEntryTypes.AMM)[0]
  if (!lpNode) {
    return undefined
  }

  const {
    NewFields: newFields,
    FinalFields: finalFields,
    PreviousFields: previousFields,
  } = lpNode

  const fields = newFields ?? finalFields
  const amount = newFields
    ? Number(newFields.LPTokenBalance.value)
    : Math.abs(
        Number(finalFields.LPTokenBalance.value) -
          Number(previousFields?.LPTokenBalance.value ?? 0),
      )

  return {
    issuer: fields.issuer,
    currency: fields.currency,
    amount,
  }
}

/*
Get the amount deposited from the metadata of the transaction

XRP changes to accounts exist in the AccountRoot leger objects while other asset changes can be found in RippleState
changes.
 */
export function findAssetAmount(
  meta: any,
  asset: { currency?: string; issuer?: string; mpt_issuance_id?: string },
  tx: BaseTransaction,
): ExplorerAmount | undefined {
  // Handle MPT assets
  if (asset.mpt_issuance_id) {
    return findMPTAmount(meta, asset.mpt_issuance_id)
  }

  if (asset.currency === 'XRP') return findXRPAmount(meta, tx)

  const assetNode = findNodeWithAsset(
    meta,
    LedgerEntryTypes.RippledState,
    asset,
  )

  const amount = assetNode?.FinalFields?.Balance
    ? Math.abs(
        Number(assetNode.FinalFields.Balance.value) -
          Number(assetNode.PreviousFields.Balance.value),
      )
    : Number(assetNode?.NewFields?.Balance)

  return amount
    ? { currency: asset.currency!, issuer: asset.issuer, amount }
    : undefined
}

/*
  All affected rippled state entries will either have their absolute asset amounts increase or decrease by the same
  number so we can use any returned ripple state node.

  i.e. if we deposit into the amm, the amm balance will go up by the same amount that the account balance decreases,
  therefore it doesnt matter which node we use.
*/
function findMPTAmount(
  meta: any,
  mptIssuanceId: string,
): ExplorerAmount | undefined {
  const mptNodes = findNodes(meta, LedgerEntryTypes.MPToken).filter(
    (n: any) =>
      (n.FinalFields?.MPTokenIssuanceID || n.NewFields?.MPTokenIssuanceID) ===
      mptIssuanceId,
  )

  if (mptNodes.length === 0) return undefined

  const node = mptNodes[0]
  // MPTAmount can be up to 2^63 - 1, beyond Number.MAX_SAFE_INTEGER,
  // so parse and subtract with BigInt to preserve precision.
  const delta =
    node.FinalFields?.MPTAmount != null
      ? BigInt(node.FinalFields.MPTAmount) -
        BigInt(node.PreviousFields?.MPTAmount ?? 0)
      : BigInt(node.NewFields?.MPTAmount ?? 0)
  const amount = (delta < 0n ? -delta : delta).toString()

  return amount !== '0'
    ? { currency: mptIssuanceId, amount, isMPT: true }
    : undefined
}

function findXRPAmount(
  meta: any,
  tx: BaseTransaction,
): ExplorerAmount | undefined {
  const xrp = findNodes(meta, LedgerEntryTypes.AccountRoot).filter(
    (n: any) =>
      n.FinalFields?.Account === tx.Account ||
      n.NewFields?.Account === tx.Account,
  )[0]

  let balance = Math.abs(
    xrp?.FinalFields?.Balance
      ? Number(xrp.FinalFields.Balance) - Number(xrp.PreviousFields.Balance)
      : Number(xrp?.NewFields?.Balance),
  )
  balance = Math.abs(balance - Number(tx.Fee))

  return balance && balance !== 0
    ? {
        currency: 'XRP',
        amount: balance / XRP_BASE,
      }
    : undefined
}

export function findNodeWithAsset(
  meta: any,
  entryType: string,
  asset: { currency?: string; issuer?: string; amount?: number },
) {
  return findNodes(meta, entryType)?.filter(
    (n: any) =>
      n.FinalFields?.Balance.currency === asset.currency ||
      n.NewFields?.Balance.currency === asset.currency,
  )[0]
}

export function findNodes(meta: any, entryType: string) {
  return meta.AffectedNodes.filter(
    (node: any) =>
      node.CreatedNode?.LedgerEntryType === entryType ||
      node.ModifiedNode?.LedgerEntryType === entryType ||
      node.DeletedNode?.LedgerEntryType === entryType,
  ).map(
    (node: any) => node.CreatedNode || node.ModifiedNode || node.DeletedNode,
  )
}
