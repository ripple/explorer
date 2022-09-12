import { OfferCreateTransaction as OfferCreate } from './OfferCreate'
import { SetRegularKeyTransaction as SetRegularKey } from './SetRegularKey'
import { SignerListSetTransaction as SignerListSet } from './SignerListSet'
import { XChainAccountCreateCommitTransaction as XChainAccountCreateCommit } from './XChainAccountCreateCommit'
import { XChainClaimTransaction as XChainClaim } from './XChainClaim'
import { XChainCommitTransaction as XChainCommit } from './XChainCommit'
import { XChainCreateBridgeTransaction as XChainCreateBridge } from './XChainCreateBridge'
import { XChainCreateClaimIDTransaction as XChainCreateClaimID } from './XChainCreateClaimID'
import { EscrowCancelTransaction as EscrowCancel } from './EscrowCancel'
import { EscrowCreateTransaction as EscrowCreate } from './EscrowCreate'
import { EscrowFinishTransaction as EscrowFinish } from './EscrowFinish'
import { XChainModifyBridgeTransaction as XChainModifyBridge } from './XChainModifyBridge'
import { TransactionMapping } from './types'

export const transactionTypes: { [key: string]: TransactionMapping } = {
  OfferCreate,
  SetRegularKey,
  SignerListSet,
  XChainAccountCreateCommit,
  XChainClaim,
  XChainCommit,
  XChainCreateBridge,
  XChainCreateClaimID,
  EscrowCreate,
  EscrowCancel,
  EscrowFinish,
  XChainModifyBridge,
}
