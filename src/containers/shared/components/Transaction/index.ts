import { AMMCreate } from './AMMCreate'
import { AMMDeposit } from './AMMDeposit'
import { AMMDeleteTransaction as AMMDelete } from './AMMDelete'
import { AMMWithdraw } from './AMMWithdraw'
import { AMMBid } from './AMMBid'
import { AMMVote } from './AMMVote'
import { AccountDeleteTransaction as AccountDelete } from './AccountDelete'
import { AccountSetTransaction as AccountSet } from './AccountSet'
import { DIDSetTransaction as DIDSet } from './DIDSet'
import { DepositPreauthTransaction as DepositPreauth } from './DepositPreauth'
import { EnableAmendmentTransaction as EnableAmendment } from './EnableAmendment'
import { NFTokenMintTransaction as NFTokenMint } from './NFTokenMint'
import { NFTokenCancelOfferTransaction as NFTokenCancelOffer } from './NFTokenCancelOffer'
import { NFTokenBurnTransaction as NFTokenBurn } from './NFTokenBurn'
import { NFTokenCreateOfferTransaction as NFTokenCreateOffer } from './NFTokenCreateOffer'
import { NFTokenAcceptOfferTransaction as NFTokenAcceptOffer } from './NFTokenAcceptOffer'
import { OfferCancelTransaction as OfferCancel } from './OfferCancel'
import { OfferCreateTransaction as OfferCreate } from './OfferCreate'
import { OracleDeleteTransaction as OracleDelete } from './OracleDelete'
import { OracleSetTransaction as OracleSet } from './OracleSet'
import { PaymentTransaction as Payment } from './Payment'
import { PaymentChannelClaimTransaction as PaymentChannelClaim } from './PaymentChannelClaim'
import { PaymentChannelCreateTransaction as PaymentChannelCreate } from './PaymentChannelCreate'
import { PaymentChannelFundTransaction as PaymentChannelFund } from './PaymentChannelFund'
import { SetFeeTransaction as SetFee } from './SetFee'
import { SetHookTransaction as SetHook } from './SetHook'
import { SetRegularKeyTransaction as SetRegularKey } from './SetRegularKey'
import { SignerListSetTransaction as SignerListSet } from './SignerListSet'
import { XChainAccountCreateCommitTransaction as XChainAccountCreateCommit } from './XChainAccountCreateCommit'
import { XChainAddAccountCreateAttestationTransaction as XChainAddAccountCreateAttestation } from './XChainAddAccountCreateAttestation'
import { XChainAddClaimAttestationTransaction as XChainAddClaimAttestation } from './XChainAddClaimAttestation'
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
import { ClawbackTransaction as Clawback } from './Clawback'

import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from './types'

export const transactionTypes: { [key: string]: TransactionMapping } = {
  AccountDelete,
  AccountSet,
  Clawback,
  DIDSet,
  DepositPreauth,
  EnableAmendment,
  NFTokenMint,
  NFTokenCancelOffer,
  NFTokenBurn,
  NFTokenCreateOffer,
  NFTokenAcceptOffer,
  OfferCancel,
  OfferCreate,
  OracleDelete,
  OracleSet,
  Payment,
  PaymentChannelCreate,
  PaymentChannelClaim,
  PaymentChannelFund,
  SetFee,
  SetHook,
  SetRegularKey,
  SignerListSet,
  XChainAccountCreateCommit,
  XChainAddAccountCreateAttestation,
  XChainAddClaimAttestation,
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
  AMMDelete,
  TrustSet,
  UNLModify,
}

export const getAction = (type: string): TransactionAction =>
  transactionTypes[type]?.action || TransactionAction.UNKNOWN

export const getCategory = (type: string): TransactionCategory =>
  transactionTypes[type]?.category || TransactionCategory.UNKNOWN
