import React from 'react'

const ENV_NETWORK_MAP: Record<string, string> = {
  mainnet: 'main',
  testnet: 'test',
  devnet: 'dev',
  xahau_mainnet: 'xahau-main',
  xahau_testnet: 'xahau-test',
}

/**
 * The VHS network ID for the current environment.
 * Custom networks are not tracked by the VHS, so they have no ID.
 */
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

export const NetworkProvider = ({ children }: React.PropsWithChildren) => (
  <NetworkContext.Provider value={getNetworkName()}>
    {children}
  </NetworkContext.Provider>
)

export { getNetworkName }

export default NetworkContext
