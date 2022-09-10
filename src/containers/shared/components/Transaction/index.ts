import { OfferCreateTransaction as OfferCreate } from './OfferCreate'
import { XChainCommitTransaction as XChainCommit } from './XChainCommit'
import { XChainCreateBridgeTransaction as XChainCreateBridge } from './XChainCreateBridge'
import { XChainCreateClaimIDTransaction as XChainCreateClaimID } from './XChainCreateClaimID'
import { EscrowCancelTransaction as EscrowCancel } from './EscrowCancel'
import { EscrowCreateTransaction as EscrowCreate } from './EscrowCreate'
import { EscrowFinishTransaction as EscrowFinish } from './EscrowFinish'
import { TransactionMapping } from './types'

export const transactionTypes: { [key: string]: TransactionMapping } = {
  OfferCreate,
  XChainCommit,
  XChainCreateBridge,
  XChainCreateClaimID,
  EscrowCreate,
  EscrowCancel,
  EscrowFinish,
}
