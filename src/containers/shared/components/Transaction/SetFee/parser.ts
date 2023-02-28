import { isPreAmendment, SetFee, SetFeeInstructions } from './types'

export const parser = (tx: SetFee): SetFeeInstructions => {
  if (isPreAmendment(tx)) {
    return {
      fee: parseInt(tx.BaseFee, 16).toString(),
      base: tx.ReserveBase.toString(),
      increment: tx.ReserveIncrement.toString(),
    }
  }

  return {
    fee: tx.BaseFeeDrops,
    base: tx.ReserveBaseDrops,
    increment: tx.ReserveIncrementDrops,
  }
}
