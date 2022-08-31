import { OfferCreateTransaction as OfferCreate } from './OfferCreate'
import { SetRegularKeyTransaction as SetRegularKey } from './SetRegularKey'
import { SignerListSetTransaction as SignerListSet } from './SignerListSet'
import { XChainClaimTransaction as XChainClaim } from './XChainClaim'
import { XChainCommitTransaction as XChainCommit } from './XChainCommit'
import { XChainCreateBridgeTransaction as XChainCreateBridge } from './XChainCreateBridge'
import { XChainCreateClaimIDTransaction as XChainCreateClaimID } from './XChainCreateClaimID'
import { TransactionMapping } from './types'

export const transactionTypes: { [key: string]: TransactionMapping } = {
  OfferCreate,
  SetRegularKey,
  SignerListSet,
  XChainClaim,
  XChainCommit,
  XChainCreateBridge,
  XChainCreateClaimID,
}
