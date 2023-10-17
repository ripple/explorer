import type { BaseTransaction } from 'xrpl'

// TODO: get type from xrpl.js once it's been added there
export interface DIDSet extends BaseTransaction {
  TransactionType: 'DIDSet'
  URI: string
  DIDDocument: string
  Attestation: string
}
