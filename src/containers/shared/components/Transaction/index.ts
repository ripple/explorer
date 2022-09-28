import { AccountDeleteTransaction as AccountDelete } from './AccountDelete'
import { AccountSetTransaction as AccountSet } from './AccountSet'
import { CheckCancelTransaction as CheckCancel } from './CheckCancel'
import { CheckCashTransaction as CheckCash } from './CheckCash'
import { CheckCreateTransaction as CheckCreate } from './CheckCreate'
import { DepositPreauthTransaction as DepositPreauth } from './DepositPreauth'
import { EnableAmendmentTransaction as EnableAmendment } from './EnableAmendment'
import { EscrowCancelTransaction as EscrowCancel } from './EscrowCancel'
import { EscrowCreateTransaction as EscrowCreate } from './EscrowCreate'
import { EscrowFinishTransaction as EscrowFinish } from './EscrowFinish'
import { NFTokenAcceptOfferTransaction as NFTokenAcceptOffer } from './NFTokenAcceptOffer'
import { NFTokenCancelOfferTransaction as NFTokenCancelOffer } from './NFTokenCancelOffer'
import { NFTokenCreateOfferTransaction as NFTokenCreateOffer } from './NFTokenCreateOffer'
import { NFTokenMintTransaction as NFTokenMint } from './NFTokenMint'
import { NFTokenBurnTransaction as NFTokenBurn } from './NFTokenBurn'
import { OfferCancelTransaction as OfferCancel } from './OfferCancel'
import { OfferCreateTransaction as OfferCreate } from './OfferCreate'
import { PaymentTransaction as Payment } from './Payment'
import { PaymentChannelClaimTransaction as PaymentChannelClaim } from './PaymentChannelClaim'
import { PaymentChannelCreateTransaction as PaymentChannelCreate } from './PaymentChannelCreate'
import { PaymentChannelFundTransaction as PaymentChannelFund } from './PaymentChannelFund'
import { SetFeeTransaction as SetFee } from './SetFee'
import { SetRegularKeyTransaction as SetRegularKey } from './SetRegularKey'
import { SignerListSetTransaction as SignerListSet } from './SignerListSet'
import { TicketCreateTransaction as TicketCreate } from './TicketCreate'
import { TrustSetTransaction as TrustSet } from './TrustSet'
import { XChainAccountCreateCommitTransaction as XChainAccountCreateCommit } from './XChainAccountCreateCommit'
import { XChainAddAttestationTransaction as XChainAddAttestation } from './XChainAddAttestation'
import { XChainClaimTransaction as XChainClaim } from './XChainClaim'
import { XChainCommitTransaction as XChainCommit } from './XChainCommit'
import { XChainCreateBridgeTransaction as XChainCreateBridge } from './XChainCreateBridge'
import { XChainCreateClaimIDTransaction as XChainCreateClaimID } from './XChainCreateClaimID'
import { XChainModifyBridgeTransaction as XChainModifyBridge } from './XChainModifyBridge'
import { TransactionMapping } from './types'

export const transactionTypes: { [key: string]: TransactionMapping } = {
  AccountDelete,
  AccountSet,
  CheckCancel,
  CheckCash,
  CheckCreate,
  DepositPreauth,
  EnableAmendment,
  EscrowCancel,
  EscrowCreate,
  EscrowFinish,
  NFTokenAcceptOffer,
  NFTokenBurn,
  NFTokenCancelOffer,
  NFTokenCreateOffer,
  NFTokenMint,
  OfferCancel,
  OfferCreate,
  Payment,
  PaymentChannelClaim,
  PaymentChannelCreate,
  PaymentChannelFund,
  SetFee,
  SetRegularKey,
  SignerListSet,
  TicketCreate,
  TrustSet,
  XChainAccountCreateCommit,
  XChainAddAttestation,
  XChainClaim,
  XChainCommit,
  XChainCreateBridge,
  XChainCreateClaimID,
  XChainModifyBridge,
}
