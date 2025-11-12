import { TransactionCommonFields } from '../types'

// TODO: remove when lending protocol (XLS-66) is supported on xrpl.js
export interface LoanSet extends TransactionCommonFields {
  LoanBrokerID: string
  Counterparty?: string
  CounterpartySignature: object
  LoanOriginationFee?: string | number
  LoanServiceFee?: string | number
  LatePaymentFee?: string | number
  ClosePaymentFee?: string | number
  OverpaymentFee?: number
  InterestRate?: number
  LateInterestRate?: number
  CloseInterestRate?: number
  OverpaymentInterestRate?: number
  PrincipalRequested: string | number
  PaymentTotal?: number
  PaymentInterval?: number
  GracePeriod?: number
  Data?: string
}
