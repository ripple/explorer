import { LoanBrokerSet } from './types'
import { convertHexToString } from '../../../../../rippled/lib/utils'
import { parsePercent } from '../../../NumberFormattingUtils'
import {
  isValidJsonString,
  ONE_TENTH_BASIS_POINT,
  ONE_TENTH_BASIS_POINT_CUTOFF,
  ONE_TENTH_BASIS_POINT_DIGITS,
} from '../../../utils'

export function parser(tx: LoanBrokerSet) {
  const dataFromHex = tx.Data ? convertHexToString(tx.Data) : undefined

  return {
    vaultID: tx.VaultID,
    loanBrokerID: tx.LoanBrokerID,
    // Pass raw DebtMaximum value - components will format with correct currency
    debtMaximumRaw: tx.DebtMaximum,
    dataFromHex,
    dataAsJson:
      dataFromHex && isValidJsonString(dataFromHex)
        ? JSON.parse(dataFromHex)
        : undefined,
    managementFeeRatePercent:
      tx.ManagementFeeRate !== undefined
        ? parsePercent(
            tx.ManagementFeeRate / ONE_TENTH_BASIS_POINT,
            ONE_TENTH_BASIS_POINT_DIGITS,
            ONE_TENTH_BASIS_POINT_CUTOFF,
          )
        : undefined,
    coverRateMinimumPercent:
      tx.CoverRateMinimum !== undefined
        ? parsePercent(
            tx.CoverRateMinimum / ONE_TENTH_BASIS_POINT,
            ONE_TENTH_BASIS_POINT_DIGITS,
            ONE_TENTH_BASIS_POINT_CUTOFF,
          )
        : undefined,
    coverRateLiquidationPercent:
      tx.CoverRateLiquidation !== undefined
        ? parsePercent(
            tx.CoverRateLiquidation / ONE_TENTH_BASIS_POINT,
            ONE_TENTH_BASIS_POINT_DIGITS,
            ONE_TENTH_BASIS_POINT_CUTOFF,
          )
        : undefined,
  }
}
