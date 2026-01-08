import { LoanBrokerSet } from './types'
import { convertHexToString } from '../../../../../rippled/lib/utils'
import { parsePercent } from '../../../NumberFormattingUtils'
import {
  isValidJsonString,
  ONE_TENTH_BASIS_POINT,
  ONE_TENTH_BASIS_POINT_CUTOFF,
  ONE_TENTH_BASIS_POINT_DIGITS,
} from '../../../utils'

export function parser(tx: LoanBrokerSet, meta?: any) {
  const dataFromHex = tx.Data ? convertHexToString(tx.Data) : undefined

  // Check if this is creating a new LoanBroker (CreatedNode)
  const isCreatingLoanBroker = meta?.AffectedNodes?.some(
    (node: any) =>
      node.CreatedNode?.LedgerEntryType === 'LoanBroker' &&
      node.CreatedNode?.NewFields?.LoanBrokerID === tx.LoanBrokerID,
  )

  // For new LoanBrokers, if DebtMaximum is omitted, default to "0" (No Limit)
  // For existing LoanBrokers, if DebtMaximum is omitted, leave as undefined (don't show)
  let debtMaximumRaw = tx.DebtMaximum
  if (debtMaximumRaw === undefined && isCreatingLoanBroker) {
    debtMaximumRaw = '0'
  }

  return {
    vaultID: tx.VaultID,
    loanBrokerID: tx.LoanBrokerID,
    // Pass raw DebtMaximum value - components will format with correct currency
    debtMaximumRaw,
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
