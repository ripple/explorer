import { TransactionMapping } from '../types';

import SidechainCreateSimple from './SidechainCreateSimple';
import SidechainCreateDescription from './SidechainCreateDescription';
import sidechainCreateMapper from './sidechainCreateMapper';
import SidechainCreateTableDetail from './SidechainCreateTableDetail';

export const SidechainCreateTransaction: TransactionMapping = {
  Description: SidechainCreateDescription,
  Simple: SidechainCreateSimple,
  TableDetail: SidechainCreateTableDetail,
  mapper: sidechainCreateMapper,
};
