import { isPreAmendment, SetFee, SetFeeInstructions } from './types'

export const parser = (tx: SetFee): SetFeeInstructions => {
  if (isPreAmendment(tx)) {
    return {
      fee: parseInt(tx.BaseFee, 16).toString(),
      reserve: tx.ReserveBase.toString(),
      increment: tx.ReserveIncrement.toString(),
    }
  }

  return {
    fee: tx.BaseFeeDrops,
    reserve: tx.ReserveBaseDrops,
    increment: tx.ReserveIncrementDrops,
  }
}
