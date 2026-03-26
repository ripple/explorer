import { LoanSet } from './types'
import { convertHexToString } from '../../../../../rippled/lib/utils'
import { parsePercent } from '../../../NumberFormattingUtils'
import {
  isValidJsonString,
  ONE_TENTH_BASIS_POINT,
  ONE_TENTH_BASIS_POINT_CUTOFF,
  ONE_TENTH_BASIS_POINT_DIGITS,
} from '../../../utils'

export function parser(tx: LoanSet) {
  const dataFromHex = tx.Data ? convertHexToString(tx.Data) : undefined

  return {
    loanBrokerID: tx.LoanBrokerID,
    counterparty: tx.Counterparty,
    principalRequestedRaw: tx.PrincipalRequested,
    paymentTotal: tx.PaymentTotal,
    paymentInterval: tx.PaymentInterval,
    gracePeriod: tx.GracePeriod,
    loanOriginationFeeRaw: tx.LoanOriginationFee,
    loanServiceFeeRaw: tx.LoanServiceFee,
    latePaymentFeeRaw: tx.LatePaymentFee,
    closePaymentFeeRaw: tx.ClosePaymentFee,
    dataFromHex,
    dataAsJson:
      dataFromHex && isValidJsonString(dataFromHex)
        ? JSON.parse(dataFromHex)
        : undefined,
    interestRatePercent:
      tx.InterestRate !== undefined
        ? parsePercent(
            tx.InterestRate / ONE_TENTH_BASIS_POINT,
            ONE_TENTH_BASIS_POINT_DIGITS,
            ONE_TENTH_BASIS_POINT_CUTOFF,
          )
        : undefined,
    lateInterestRatePercent:
      tx.LateInterestRate !== undefined
        ? parsePercent(
            tx.LateInterestRate / ONE_TENTH_BASIS_POINT,
            ONE_TENTH_BASIS_POINT_DIGITS,
            ONE_TENTH_BASIS_POINT_CUTOFF,
          )
        : undefined,
    closeInterestRatePercent:
      tx.CloseInterestRate !== undefined
        ? parsePercent(
            tx.CloseInterestRate / ONE_TENTH_BASIS_POINT,
            ONE_TENTH_BASIS_POINT_DIGITS,
            ONE_TENTH_BASIS_POINT_CUTOFF,
          )
        : undefined,
    overpaymentInterestRatePercent:
      tx.OverpaymentInterestRate !== undefined
        ? parsePercent(
            tx.OverpaymentInterestRate / ONE_TENTH_BASIS_POINT,
            ONE_TENTH_BASIS_POINT_DIGITS,
            ONE_TENTH_BASIS_POINT_CUTOFF,
          )
        : undefined,
    overpaymentFeePercent:
      tx.OverpaymentFee !== undefined
        ? parsePercent(
            tx.OverpaymentFee / ONE_TENTH_BASIS_POINT,
            ONE_TENTH_BASIS_POINT_DIGITS,
            ONE_TENTH_BASIS_POINT_CUTOFF,
          )
        : undefined,
  }
}
