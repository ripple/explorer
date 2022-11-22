import React from 'react'

const ENV_NETWORK_MAP: Record<string, string> = {
  mainnet: 'main',
  testnet: 'test',
  devnet: 'dev',
  nft_sandbox: 'nft-dev',
}

function getNetworkName() {
  if (
    process.env.REACT_APP_ENVIRONMENT &&
    process.env.REACT_APP_ENVIRONMENT in ENV_NETWORK_MAP
  ) {
    return ENV_NETWORK_MAP[process.env.REACT_APP_ENVIRONMENT]
  }
  return undefined
}

const NetworkContext = React.createContext(undefined)

export { getNetworkName }

export default NetworkContext
