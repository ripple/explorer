import { XRP_BASE } from './transactionUtils'

export const LedgerEntryTypes = {
  AccountRoot: 'AccountRoot',
  RippledState: 'RippleState',
  AMM: 'AMM',
}

export function getAuthAccounts(tx: any) {
  return tx.AuthAccounts?.map((acc: any) => acc?.AuthAccount?.Account)
}

export function getMinBid(tx: any) {
  return { currency: 'LP', issuer: tx.BidMin?.issuer, amount: tx.BidMin?.value }
}

/*
Gets the AMM account ID
 */
export function getAMMAccountID(meta: any) {
  const accounts = findNodes(meta, LedgerEntryTypes.AMM)

  return (
    accounts[0]?.FinalFields?.AMMAccount || accounts[0]?.NewFields?.AMMAccount
  )
}

/*

 */
export function getLPTokenAmount(meta: any) {
  const lpNode = findNodes(meta, LedgerEntryTypes.RippledState).filter(
    (n: any) => (n.FinalFields || n.NewFields).Balance.currency.length > 3,
  )[0]

  if (!lpNode) {
    throw new Error('No node found')
  }

  const balance = (lpNode.FinalFields ?? lpNode.NewFields).Balance
  const amount = lpNode.FinalFields?.Balance
    ? Math.abs(
        Number(lpNode.FinalFields.Balance.value) -
          Number(lpNode.PreviousFields.Balance.value),
      )
    : Number(lpNode.NewFields?.Balance.value)

  return { issuer: balance.issuer, currency: balance.currency, amount }
}

/*
Get the amount deposited from the metadata of the transaction

XRP changes to accounts exist in the AccountRoot leger objects while other asset changes can be found in RippleState
changes.
 */
export function findAssetAmount(
  meta: any,
  asset: { currency: string; issuer?: string; amount?: number },
) {
  if (asset.currency === 'XRP') return findXRPAmount(meta)

  const assetNode = findNodeWithAsset(
    meta,
    LedgerEntryTypes.RippledState,
    asset,
  )

  return assetNode?.FinalFields?.Balance
    ? Math.abs(
        Number(assetNode.FinalFields.Balance.value) -
          Number(assetNode.PreviousFields.Balance.value),
      )
    : Number(assetNode?.NewFields?.Balance)
}

/*
  All affected rippled state entries will either have their asset amounts increase or decrease so we
  can use any returned ripple state node
*/
function findXRPAmount(meta: any) {
  const xrp = findNodes(meta, LedgerEntryTypes.AccountRoot)[0]

  const balance = xrp?.FinalFields?.Balance
    ? Math.abs(
        Number(xrp.FinalFields.Balance) - Number(xrp.PreviousFields.Balance),
      )
    : Number(xrp?.NewFields?.Balance)

  return balance / XRP_BASE
}

export function findNodeWithAsset(
  meta: any,
  entryType: string,
  asset: { currency: string; issuer?: string; amount?: number },
) {
  return findNodes(meta, entryType)?.filter(
    (n: any) =>
      n.FinalFields?.Balance.currency === asset.currency ??
      n.NewFields?.Balance.currency === asset.currency,
  )[0]
}

export function findNodes(meta: any, entryType: string) {
  return meta.AffectedNodes.filter(
    (node: any) =>
      node.CreatedNode?.LedgerEntryType === entryType ||
      node.ModifiedNode?.LedgerEntryType === entryType,
  ).map((node: any) => node.CreatedNode ?? node.ModifiedNode)
}
