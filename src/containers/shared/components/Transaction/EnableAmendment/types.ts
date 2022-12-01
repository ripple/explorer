import { TransactionCommonFields } from '../types'

export interface EnableAmendment extends TransactionCommonFields {
  Amendment: string
}
