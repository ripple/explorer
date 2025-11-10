import { LoanBrokerSet } from './types'
import { convertHexToString } from '../../../../../rippled/lib/utils'
import { parsePercent } from '../../../NumberFormattingUtils'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { isValidJsonString, ONE_TENTH_BASIS_POINT } from '../../../utils'

export function parser(tx: LoanBrokerSet) {
  const dataFromHex = tx.Data ? convertHexToString(tx.Data) : undefined

  return {
    vaultID: tx.VaultID,
    loanBrokerID: tx.LoanBrokerID,
    debtMaximum:
      tx.DebtMaximum !== undefined ? formatAmount(tx.DebtMaximum) : undefined,
    dataFromHex,
    dataAsJson:
      dataFromHex && isValidJsonString(dataFromHex)
        ? JSON.parse(dataFromHex)
        : undefined,
    managementFeeRatePercent:
      tx.ManagementFeeRate !== undefined
        ? parsePercent(tx.ManagementFeeRate / ONE_TENTH_BASIS_POINT)
        : undefined,
    coverRateMinimumPercent:
      tx.CoverRateMinimum !== undefined
        ? parsePercent(tx.CoverRateMinimum / ONE_TENTH_BASIS_POINT)
        : undefined,
    coverRateLiquidationPercent:
      tx.CoverRateLiquidation !== undefined
        ? parsePercent(tx.CoverRateLiquidation / ONE_TENTH_BASIS_POINT)
        : undefined,
  }
}
