import type { BaseTransaction } from 'xrpl'

export interface OracleDelete extends BaseTransaction {
  OracleDocumentID: string
}
