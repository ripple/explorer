import React from 'react'

const ENV_NETWORK_MAP: Record<string, string> = {
  mainnet: 'main',
  testnet: 'test',
  devnet: 'dev',
  nft_sandbox: 'nft-dev',
  amm: 'amm-dev',
}

function getNetworkName() {
  if (
    process.env.VITE_ENVIRONMENT &&
    process.env.VITE_ENVIRONMENT in ENV_NETWORK_MAP
  ) {
    return ENV_NETWORK_MAP[process.env.VITE_ENVIRONMENT]
  }
  return undefined
}

const NetworkContext = React.createContext(getNetworkName())

export { getNetworkName }

export default NetworkContext
