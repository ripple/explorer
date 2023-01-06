const ENV_NETWORK_MAP: Record<string, string> = {
  mainnet: 'main',
  testnet: 'test',
  devnet: 'dev',
  nft_sandbox: 'nft-dev',
  amm: 'amm-dev',
}

const getNetworkFromEnv = () =>
  ENV_NETWORK_MAP[process.env.VITE_ENVIRONMENT ?? ''] ?? ''

export { getNetworkFromEnv }
