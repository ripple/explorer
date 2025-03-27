import type {
  BaseTransaction,
  Currency,
  IssuedCurrency,
  IssuedCurrencyAmount,
} from 'xrpl'

// TODO: use type from xrpl.js when available.
export interface AMMClawback extends BaseTransaction {
  TransactionType: 'AMMClawback'
  Asset: IssuedCurrency
  Asset2: Currency
  Amount?: IssuedCurrencyAmount
  Holder: string
}
