import type { BaseTransaction } from 'xrpl'

// TODO: get type from xrpl.js once it's been added there
export interface DIDDelete extends BaseTransaction {
  TransactionType: 'DIDDelete'
}
