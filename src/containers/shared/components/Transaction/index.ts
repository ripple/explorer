import { OfferCreateTransaction as OfferCreate } from './OfferCreate'
import { XChainCommitTransaction as XChainCommit } from './XChainCommit'
import { XChainCreateBridgeTransaction as XChainCreateBridge } from './XChainCreateBridge'
import { XChainCreateClaimIDTransaction as XChainCreateClaimID } from './XChainCreateClaimID'
import { TransactionMapping } from './types'
import { SetRegularKeyTransaction as SetRegularKey } from './SetRegularKey'

export const transactionTypes: { [key: string]: TransactionMapping } = {
  OfferCreate,
  SetRegularKey,
  XChainCommit,
  XChainCreateBridge,
  XChainCreateClaimID,
}
