import { OfferCreateTransaction as OfferCreate } from './OfferCreate'
import { SidechainXChainTransferTransaction as SidechainXChainTransfer } from './SidechainXChainTransfer'
import { XChainCreateBridgeTransaction as XChainCreateBridge } from './XChainCreateBridge'
import { XChainCreateClaimIDTransaction as XChainCreateClaimID } from './XChainCreateClaimID'
import { TransactionMapping } from './types'

export const transactionTypes: { [key: string]: TransactionMapping } = {
  OfferCreate,
  SidechainXChainTransfer,
  XChainCreateBridge,
  XChainCreateClaimID,
}
