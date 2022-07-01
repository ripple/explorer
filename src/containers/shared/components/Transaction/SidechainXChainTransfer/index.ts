import { TransactionMapping } from '../types';

import SidechainXChainTransferSimple from './SidechainXChainTransferSimple';
import sidechainXChainTransferMapper from './sidechainXChainTransferMapper';

export const SidechainXChainTransferTransaction: TransactionMapping = {
  Description: null,
  Simple: SidechainXChainTransferSimple,
  TableDetail: null,
  mapper: sidechainXChainTransferMapper,
};
