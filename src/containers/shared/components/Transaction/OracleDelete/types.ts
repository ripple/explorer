import type { BaseTransaction } from 'xrpl'

// TODO: get type from xrpl.js once it's been added there
export interface OracleDelete extends BaseTransaction {
  OracleDocumentID: string
}
