export interface PairValue {
  num: string
  unit: string
}

export interface Pair {
  low: PairValue
  high: PairValue
  average: PairValue
  issuer: string
  token: string
}
