import { XRP_BASE } from './transactionUtils'
import { ExplorerAmount } from './types'
import { TransactionCommonFields } from './components/Transaction/types'

export const LedgerEntryTypes = {
  AccountRoot: 'AccountRoot',
  RippledState: 'RippleState',
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

  return account.FinalFields?.AMMAccount || account.NewFields?.AMMAccount
}

export function getLPTokenAmount(meta: any) {
  // TODO: possibility of bug if currency that isnt LP token has 03 at the start
  const lpNode = findNodes(meta, LedgerEntryTypes.RippledState).filter(
    (n: any) =>
      (
        n.FinalFields ||
        n.NewFields ||
        n.DeletedNode
      )?.Balance.currency.substring(0, 2) === '03',
  )[0]

  if (lpNode) {
    const balance = (lpNode.FinalFields ?? lpNode.NewFields).Balance
    const amount = lpNode.FinalFields?.Balance
      ? Math.abs(
          Number(lpNode.FinalFields.Balance.value) -
            Number(lpNode.PreviousFields.Balance.value),
        )
      : Number(lpNode.NewFields?.Balance.value)

    return { issuer: balance.issuer, currency: balance.currency, amount }
  }

  return undefined
}

/*
Get the amount deposited from the metadata of the transaction

XRP changes to accounts exist in the AccountRoot leger objects while other asset changes can be found in RippleState
changes.
 */
export function findAssetAmount(
  meta: any,
  asset: { currency: string; issuer?: string },
  tx: TransactionCommonFields,
): ExplorerAmount | undefined {
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
    ? { currency: asset.currency, issuer: asset.issuer, amount }
    : undefined
}

/*
  All affected rippled state entries will either have their absolute asset amounts increase or decrease by the same
  number so we can use any returned ripple state node.

  i.e. if we deposit into the amm, the amm balance will go up by the same amount that the account balance decreases,
  therefore it doesnt matter which node we use.
*/
function findXRPAmount(
  meta: any,
  tx: TransactionCommonFields,
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
  balance -= Number(tx.Fee)

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
  asset: { currency: string; issuer?: string; amount?: number },
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
