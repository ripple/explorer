import { OfferCreateTransaction as OfferCreate } from './OfferCreate'
import { XChainCreateBridgeTransaction as XChainCreateBridge } from './XChainCreateBridge'
import { SidechainXChainSeqNumCreateTransaction as SidechainXChainSeqNumCreate } from './SidechainXChainSeqNumCreate'
import { TransactionMapping } from './types'

export const transactionTypes: { [key: string]: TransactionMapping } = {
  OfferCreate,
  XChainCreateBridge,
  SidechainXChainSeqNumCreate,
}
