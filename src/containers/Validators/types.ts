export interface ValidatorReport {
  chain: string
  date: string
  incomplete: boolean
  missed: string
  score: string
  total: string
  // eslint-disable-next-line camelcase -- mimicking rippled
  validation_public_key: string
}
