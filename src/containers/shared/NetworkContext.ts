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
    import.meta.env.VITE_ENVIRONMENT &&
    import.meta.env.VITE_ENVIRONMENT in ENV_NETWORK_MAP
  ) {
    return ENV_NETWORK_MAP[import.meta.env.VITE_ENVIRONMENT]
  }
  return undefined
}

const NetworkContext = React.createContext(undefined)

export { getNetworkName }

export default NetworkContext
