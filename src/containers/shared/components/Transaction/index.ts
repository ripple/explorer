import { OfferCreateTransaction as OfferCreate } from './OfferCreate'
import { XChainCommitTransaction as XChainCommit } from './XChainCommit'
import { XChainCreateBridgeTransaction as XChainCreateBridge } from './XChainCreateBridge'
import { XChainCreateClaimIDTransaction as XChainCreateClaimID } from './XChainCreateClaimID'
import { TransactionMapping } from './types'
import { SignerListSetTransaction as SignerListSet } from './SignerListSet'

export const transactionTypes: { [key: string]: TransactionMapping } = {
  OfferCreate,
  SignerListSet,
  XChainCommit,
  XChainCreateBridge,
  XChainCreateClaimID,
}
