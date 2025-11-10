import { LoanSet } from './types'
import { convertHexToString } from '../../../../../rippled/lib/utils'
import { parsePercent } from '../../../NumberFormattingUtils'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { isValidJsonString, ONE_TENTH_BASIS_POINT } from '../../../utils'

export function parser(tx: LoanSet) {
  const dataFromHex = tx.Data ? convertHexToString(tx.Data) : undefined

  return {
    loanBrokerID: tx.LoanBrokerID,
    counterparty: tx.Counterparty,
    principalRequested: formatAmount(tx.PrincipalRequested),
    paymentTotal: tx.PaymentTotal,
    paymentInterval: tx.PaymentInterval,
    gracePeriod: tx.GracePeriod,
    loanOriginationFee: tx.LoanOriginationFee
      ? formatAmount(tx.LoanOriginationFee)
      : undefined,
    loanServiceFee: tx.LoanServiceFee
      ? formatAmount(tx.LoanServiceFee)
      : undefined,
    latePaymentFee: tx.LatePaymentFee
      ? formatAmount(tx.LatePaymentFee)
      : undefined,
    closePaymentFee: tx.ClosePaymentFee
      ? formatAmount(tx.ClosePaymentFee)
      : undefined,
    dataFromHex,
    dataAsJson:
      dataFromHex && isValidJsonString(dataFromHex)
        ? JSON.parse(dataFromHex)
        : undefined,
    interestRatePercent:
      tx.InterestRate !== undefined
        ? parsePercent(tx.InterestRate / ONE_TENTH_BASIS_POINT)
        : undefined,
    lateInterestRatePercent:
      tx.LateInterestRate !== undefined
        ? parsePercent(tx.LateInterestRate / ONE_TENTH_BASIS_POINT)
        : undefined,
    closeInterestRatePercent:
      tx.CloseInterestRate !== undefined
        ? parsePercent(tx.CloseInterestRate / ONE_TENTH_BASIS_POINT)
        : undefined,
    overpaymentInterestRatePercent:
      tx.OverpaymentInterestRate !== undefined
        ? parsePercent(tx.OverpaymentInterestRate / ONE_TENTH_BASIS_POINT)
        : undefined,
    overpaymentFeePercent:
      tx.OverpaymentFee !== undefined
        ? parsePercent(tx.OverpaymentFee / ONE_TENTH_BASIS_POINT)
        : undefined,
  }
}
