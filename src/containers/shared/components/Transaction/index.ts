import { AMMCreate } from 'containers/shared/components/Transaction/AMM/AMMInstanceCreate'
import { AMMDeposit } from 'containers/shared/components/Transaction/AMM/AMMDeposit'
import { AMMWithdraw } from 'containers/shared/components/Transaction/AMM/AMMWithdraw'
import { AMMBid } from 'containers/shared/components/Transaction/AMM/AMMBid'
import { AMMVote } from 'containers/shared/components/Transaction/AMM/AMMVote'
import { AccountDeleteTransaction as AccountDelete } from './AccountDelete'
import { AccountSetTransaction as AccountSet } from './AccountSet'
import { DepositPreauthTransaction as DepositPreauth } from './DepositPreauth'
import { EnableAmendmentTransaction as EnableAmendment } from './EnableAmendment'
import { NFTokenMintTransaction as NFTokenMint } from './NFTokenMint'
import { NFTokenCancelOfferTransaction as NFTokenCancelOffer } from './NFTokenCancelOffer'
import { NFTokenBurnTransaction as NFTokenBurn } from './NFTokenBurn'
import { NFTokenCreateOfferTransaction as NFTokenCreateOffer } from './NFTokenCreateOffer'
import { NFTokenAcceptOfferTransaction as NFTokenAcceptOffer } from './NFTokenAcceptOffer'
import { OfferCancelTransaction as OfferCancel } from './OfferCancel'
import { OfferCreateTransaction as OfferCreate } from './OfferCreate'
import { PaymentTransaction as Payment } from './Payment'
import { PaymentChannelClaimTransaction as PaymentChannelClaim } from './PaymentChannelClaim'
import { PaymentChannelCreateTransaction as PaymentChannelCreate } from './PaymentChannelCreate'
import { PaymentChannelFundTransaction as PaymentChannelFund } from './PaymentChannelFund'
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
import { TicketCreateTransaction as TicketCreate } from './TicketCreate'
import { TrustSetTransaction as TrustSet } from './TrustSet'
import { UNLModifyTransaction as UNLModify } from './UNLModify'

import { TransactionMapping } from './types'

export const transactionTypes: { [key: string]: TransactionMapping } = {
  AccountDelete,
  AccountSet,
  DepositPreauth,
  EnableAmendment,
  NFTokenMint,
  NFTokenCancelOffer,
  NFTokenBurn,
  NFTokenCreateOffer,
  NFTokenAcceptOffer,
  OfferCancel,
  OfferCreate,
  Payment,
  PaymentChannelCreate,
  PaymentChannelClaim,
  PaymentChannelFund,
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
  TicketCreate,
  AMMCreate,
  AMMWithdraw,
  AMMDeposit,
  AMMBid,
  AMMVote,
  TrustSet,
  UNLModify,
}
