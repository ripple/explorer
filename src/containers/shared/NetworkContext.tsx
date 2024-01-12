import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Log from './log'

const ENV_NETWORK_MAP: Record<string, string> = {
  mainnet: 'main',
  testnet: 'test',
  devnet: 'dev',
  xahau_mainnet: 'xahau-main',
  xahau_testnet: 'xahau-test',
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

export type NetworkProviderProps = React.PropsWithChildren<{
  children: any
  rippledUrl?: string
}>

export const NetworkProvider = ({
  children,
  rippledUrl,
}: NetworkProviderProps) => {
  const initialNetworkName = getNetworkName()
  const [networkName, setNetworkName] = useState(initialNetworkName)

  useEffect(() => {
    if (initialNetworkName == null && rippledUrl) {
      axios
        .get(`${process.env.VITE_DATA_URL}/get_network/${rippledUrl}`)
        .then((resp) => resp.data)
        .then((data) =>
          setNetworkName(
            data.result && data.result === 'error' ? null : data.network,
          ),
        )
        .catch((e) => Log.error(e))
    }
  }, [initialNetworkName, rippledUrl])

  return (
    <NetworkContext.Provider value={networkName}>
      {children}
    </NetworkContext.Provider>
  )
}

export { getNetworkName }

export default NetworkContext
