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
