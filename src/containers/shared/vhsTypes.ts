export interface NodeResponse {
  // eslint-disable-next-line camelcase -- from VHS
  node_public_key: string
  networks?: string
  lat?: number
  long?: number
  // eslint-disable-next-line camelcase -- from VHS
  complete_ledgers?: string
  // eslint-disable-next-line camelcase -- from VHS
  complete_shards?: string
  version?: string
  ip?: string
  port?: number
  uptime?: number
  // eslint-disable-next-line camelcase -- from VHS
  country_code?: number
  country?: string
  region?: string
  // eslint-disable-next-line camelcase -- from VHS
  region_code?: number
  city?: string
  // eslint-disable-next-line camelcase -- from VHS
  postal_code?: number
  timezone?: string
  // eslint-disable-next-line camelcase -- from VHS
  server_state?: string
  // eslint-disable-next-line camelcase -- from VHS
  io_latency_ms?: number
  // eslint-disable-next-line camelcase -- from VHS
  load_factor_server?: number
}

export interface NodeData extends NodeResponse {
  // eslint-disable-next-line camelcase -- mimicking rippled
  validated_ledger: {
    // eslint-disable-next-line camelcase -- mimicking rippled
    ledger_index: number
  }
  // eslint-disable-next-line camelcase -- mimicking rippled
  load_factor: number | null
}

export interface ValidatorScore {
  missed: number
  total: number
  score: string
  incomplete: boolean
}

export interface ValidatorReport {
  missed: string
  total: string
  score: string
  incomplete: boolean
  chain: string
  date: string
  // eslint-disable-next-line camelcase -- mimicking rippled
  validation_public_key: string
}

export interface ValidatorResponse {
  // eslint-disable-next-line camelcase -- from VHS
  validation_public_key: string
  // eslint-disable-next-line camelcase -- from VHS
  signing_key: string
  // eslint-disable-next-line camelcase -- from VHS
  master_key?: string
  revoked?: boolean
  domain: string
  chain: string
  networks?: string
  // eslint-disable-next-line camelcase -- from VHS
  current_index: number
  // eslint-disable-next-line camelcase -- from VHS
  server_version?: string
  // eslint-disable-next-line camelcase -- from VHS
  agreement_1h: ValidatorScore | null
  // eslint-disable-next-line camelcase -- from VHS
  agreement_24h: ValidatorScore | null
  // eslint-disable-next-line camelcase -- from VHS
  agreement_30day: ValidatorScore | null
  partial: boolean
  unl: string
}

export interface ValidatorSupplemented extends ValidatorResponse {
  // eslint-disable-next-line camelcase -- mimicking rippled
  ledger_hash: string
  // eslint-disable-next-line camelcase -- mimicking rippled
  last_ledger_time: string
}

export interface StreamValidator extends ValidatorResponse {
  // eslint-disable-next-line camelcase -- mimicking rippled
  ledger_index?: number
  // eslint-disable-next-line camelcase -- mimicking rippled
  ledger_hash?: string
  pubkey?: string
  time?: string
}
