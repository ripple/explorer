import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { LoanBrokerCoverClawback } from './types'

// XRPL neutral issuer address used in RippleState balance objects
const XRPL_NEUTRAL_ISSUER = 'rrrrrrrrrrrrrrrrrrrrBZbvji'

export function parser(tx: LoanBrokerCoverClawback, meta: any) {
  const loanBrokerNode = meta.AffectedNodes?.find(
    (node: any) =>
      (node.ModifiedNode &&
        node.ModifiedNode.LedgerEntryType === 'LoanBroker') ||
      (node.DeletedNode && node.DeletedNode.LedgerEntryType === 'LoanBroker'),
  )

  let calculatedAmount = tx.Amount
  let loanBrokerData

  if (loanBrokerNode) {
    const nodeData = loanBrokerNode.ModifiedNode || loanBrokerNode.DeletedNode
    const fields = nodeData.FinalFields || nodeData.PreviousFields

    if (fields) {
      loanBrokerData = {
        CoverAvailable: fields.CoverAvailable,
        DebtTotal: fields.DebtTotal,
        CoverRateMinimum: fields.CoverRateMinimum,
      }

      // If Amount is 0 or unset, calculate it using the formula:
      // Amount = CoverAvailable - (DebtTotal * CoverRateMinimum)
      if (
        !tx.Amount ||
        (typeof tx.Amount === 'string' && tx.Amount === '0') ||
        (typeof tx.Amount === 'object' && tx.Amount.value === '0')
      ) {
        const previousFields = nodeData.PreviousFields
        const coverAvailable = parseFloat(
          previousFields?.CoverAvailable || fields.CoverAvailable || '0',
        )
        const debtTotal = parseFloat(fields.DebtTotal || '0')
        const coverRateMinimum = fields.CoverRateMinimum || 0

        // CoverRateMinimum is in 1/10th basis points, so divide by 100000
        const requiredCover = debtTotal * (coverRateMinimum / 100000)
        let clawbackAmount = Math.max(0, coverAvailable - requiredCover)

        // For MPT, calculate actual clawback from MPToken balance changes
        const mpTokenNode = meta.AffectedNodes?.find(
          (node: any) =>
            node.ModifiedNode &&
            node.ModifiedNode.LedgerEntryType === 'MPToken',
        )

        if (mpTokenNode) {
          const tokenData = mpTokenNode.ModifiedNode
          const previousAmount = parseFloat(
            tokenData.PreviousFields?.MPTAmount || '0',
          )
          const finalAmount = parseFloat(
            tokenData.FinalFields?.MPTAmount || '0',
          )
          // Clawback amount is the reduction in MPTAmount
          clawbackAmount = Math.max(0, previousAmount - finalAmount)
        }

        if (typeof tx.Amount === 'object') {
          if ('issuer' in tx.Amount) {
            // IOU
            calculatedAmount = {
              currency: tx.Amount.currency,
              issuer: tx.Amount.issuer,
              value: clawbackAmount.toString(),
            }
          } else {
            // MPT
            calculatedAmount = {
              mpt_issuance_id: tx.Amount.mpt_issuance_id,
              value: clawbackAmount.toString(),
            }
          }
        } else if (tx.Amount === undefined) {
          // Amount is undefined, infer currency from RippleState or MPToken changes in metadata
          const rippleStateNode = meta.AffectedNodes?.find(
            (node: any) =>
              (node.ModifiedNode &&
                node.ModifiedNode.LedgerEntryType === 'RippleState') ||
              (node.CreatedNode &&
                node.CreatedNode.LedgerEntryType === 'RippleState'),
          )

          const mpTokenNodeForInference = meta.AffectedNodes?.find(
            (node: any) =>
              (node.ModifiedNode &&
                node.ModifiedNode.LedgerEntryType === 'MPToken') ||
              (node.CreatedNode &&
                node.CreatedNode.LedgerEntryType === 'MPToken'),
          )

          if (rippleStateNode) {
            const stateData =
              rippleStateNode.ModifiedNode || rippleStateNode.CreatedNode
            const balance =
              stateData.FinalFields?.Balance || stateData.NewFields?.Balance

            if (balance && typeof balance === 'object' && balance.currency) {
              // Found a currency balance change, use this currency
              calculatedAmount = {
                currency: balance.currency,
                issuer:
                  balance.issuer === XRPL_NEUTRAL_ISSUER
                    ? stateData.FinalFields?.LowLimit?.issuer ||
                      stateData.FinalFields?.HighLimit?.issuer
                    : balance.issuer,
                value: clawbackAmount.toString(),
              }
            } else {
              // Fallback to XRP
              calculatedAmount = Math.floor(clawbackAmount * 1000000).toString()
            }
          } else if (mpTokenNodeForInference) {
            const tokenData =
              mpTokenNodeForInference.ModifiedNode ||
              mpTokenNodeForInference.CreatedNode
            const mpTokenIssuanceID =
              tokenData.FinalFields?.MPTokenIssuanceID ||
              tokenData.NewFields?.MPTokenIssuanceID

            if (mpTokenIssuanceID) {
              calculatedAmount = {
                mpt_issuance_id: mpTokenIssuanceID,
                value: clawbackAmount.toString(),
              }
            } else {
              // Fallback to XRP
              calculatedAmount = Math.floor(clawbackAmount * 1000000).toString()
            }
          } else {
            // No RippleState or MPToken found, assume XRP
            calculatedAmount = Math.floor(clawbackAmount * 1000000).toString()
          }
        } else {
          // For XRP amounts, convert to drops
          calculatedAmount = Math.floor(clawbackAmount * 1000000).toString()
        }
      }
    }
  }

  return {
    loanBrokerID: tx.LoanBrokerID,
    amount: tx.Amount ? formatAmount(tx.Amount) : undefined,
    calculatedAmount: calculatedAmount
      ? formatAmount(calculatedAmount)
      : undefined,
    loanBrokerData,
  }
}
