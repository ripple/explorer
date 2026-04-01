import { useContext, useState } from 'react'
import { useQuery } from 'react-query'
import SocketContext from '../SocketContext'
import { getAccountLines } from '../../../rippled/lib/rippled'
import Log from '../log'

const FETCH_INTERVAL_MILLIS = 5 * 1000 // 1 minute
const XRP_USD_ORACLE_ACCOUNT = 'rXUMMaPpZqPutoRszR29jtC8amWq3APkx'

const fetchXRPToUSDRate = async (rippledSocket: any) => {
  const accountLines = await getAccountLines(
    rippledSocket,
    XRP_USD_ORACLE_ACCOUNT,
    1,
  )

  return accountLines.lines[0]?.limit ?? 0.0
}

/**
 * Returns the current exchange rate for XRP to USD.
 * Retries {@link FETCH_RETRY_COUNT} times on failure and falls back to the last successful value if fetching fails.
 */
export function useXRPToUSDRate(): number {
  const isMainnet = process.env.VITE_ENVIRONMENT === 'mainnet'

  const rippledSocket = useContext(SocketContext)
  const [lastRate, setLastRate] = useState<number>(0.0)

  const { data } = useQuery(
    ['XRPToUSDRate'],
    () => fetchXRPToUSDRate(rippledSocket),
    {
      enabled: isMainnet,
      refetchInterval: FETCH_INTERVAL_MILLIS,
      onSuccess: (rate: number) => setLastRate(rate), // store the last successfully fetched rate
      onError: (error) => Log.error(error), // do nothing, last rate stays
    },
  )

  if (!isMainnet) {
    return 1.5 // This is chosen randomly for non-mainnet environments
  }

  return data ?? lastRate
}
