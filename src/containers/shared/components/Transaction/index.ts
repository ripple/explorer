import { OfferCreateTransaction as OfferCreate } from './OfferCreate';
import { XChainCreateBridgeTransaction as XChainCreateBridge } from './XChainCreateBridge';
import { XChainCommitTransaction as XChainCommit } from './XChainCommit';
import { TransactionMapping } from './types';

export const transactionTypes: { [key: string]: TransactionMapping } = {
  OfferCreate,
  XChainCreateBridge,
  XChainCommit,
};
