import { NFTokenBurnTransaction as NFTokenBurn } from './NFTokenBurn'
import { NFTokenCreateOfferTransaction as NFTokenCreateOffer } from './NFTokenCreateOffer'
import { NFTokenAcceptOfferTransaction as NFTokenAcceptOffer } from './NFTokenAcceptOffer'
import { OfferCreateTransaction as OfferCreate } from './OfferCreate'
import { SetRegularKeyTransaction as SetRegularKey } from './SetRegularKey'
import { SignerListSetTransaction as SignerListSet } from './SignerListSet'
import { XChainAccountCreateCommitTransaction as XChainAccountCreateCommit } from './XChainAccountCreateCommit'
import { XChainAddAttestationTransaction as XChainAddAttestation } from './XChainAddAttestation'
import { XChainClaimTransaction as XChainClaim } from './XChainClaim'
import { XChainCommitTransaction as XChainCommit } from './XChainCommit'
import { XChainCreateBridgeTransaction as XChainCreateBridge } from './XChainCreateBridge'
import { XChainCreateClaimIDTransaction as XChainCreateClaimID } from './XChainCreateClaimID'
import { XChainModifyBridgeTransaction as XChainModifyBridge } from './XChainModifyBridge'
import { EscrowCreateTransaction as EscrowCreate } from './EscrowCreate'
import { EscrowFinishTransaction as EscrowFinish } from './EscrowFinish'
import { EscrowCancelTransaction as EscrowCancel } from './EscrowCancel'
import { TransactionMapping } from './types'

export const transactionTypes: { [key: string]: TransactionMapping } = {
  NFTokenBurn,
  NFTokenCreateOffer,
  NFTokenAcceptOffer,
  OfferCreate,
  SetRegularKey,
  SignerListSet,
  XChainAccountCreateCommit,
  XChainAddAttestation,
  XChainClaim,
  XChainCommit,
  XChainCreateBridge,
  XChainCreateClaimID,
  XChainModifyBridge,
  EscrowCreate,
  EscrowFinish,
  EscrowCancel,
}
