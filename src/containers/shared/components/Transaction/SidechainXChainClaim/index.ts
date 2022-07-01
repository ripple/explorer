import { TransactionMapping } from '../types';

import SidechainXChainClaimSimple from './SidechainXChainClaimSimple';
import sidechainXChainClaimMapper from './sidechainXChainClaimMapper';

export const SidechainXChainClaimTransaction: TransactionMapping = {
  Description: null,
  Simple: SidechainXChainClaimSimple,
  TableDetail: null,
  mapper: sidechainXChainClaimMapper,
};
