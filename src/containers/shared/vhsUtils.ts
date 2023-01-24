const ENV_NETWORK_MAP: Record<string, string> = {
  mainnet: 'main',
  testnet: 'test',
  devnet: 'dev',
  amm: 'amm-dev',
}

const getNetworkFromEnv = () =>
  ENV_NETWORK_MAP[process.env.REACT_APP_ENVIRONMENT ?? ''] ?? ''

export { getNetworkFromEnv }
