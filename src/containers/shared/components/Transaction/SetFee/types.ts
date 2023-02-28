import { TransactionCommonFields } from '../types'

export interface SetFeePreAmendment extends TransactionCommonFields {
  BaseFee: string
  ReferenceFeeUnits: number
  ReserveBase: number
  ReserveIncrement: number

  BaseFeeDrops?: never
  ReserveBaseDrops?: never
  ReserveIncrementDrops?: never
}

export interface SetFeePostAmendment extends TransactionCommonFields {
  BaseFee?: never
  ReferenceFeeUnits?: never
  ReserveBase?: never
  ReserveIncrement?: never

  BaseFeeDrops: string
  ReserveBaseDrops: string
  ReserveIncrementDrops: string
}

export const isPreAmendment = (
  tx: SetFeePreAmendment | SetFeePostAmendment,
): tx is SetFeePreAmendment => (tx as SetFeePostAmendment).BaseFee !== undefined

export type SetFee = SetFeePreAmendment | SetFeePostAmendment

export interface SetFeeInstructions {
  fee: string
  base: string
  increment: string
}
