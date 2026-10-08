import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import SocketContext from '../SocketContext'
import { getAccountLines } from '../../../rippled/lib/rippled'
import Log from '../log'
import { useOnQueryError } from './useOnQueryError'

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
  // On a failed refetch the query keeps its last successful `data`, so the
  // last known rate is still returned.
  const { data, error } = useQuery({
    queryKey: ['XRPToUSDRate'],
    queryFn: () => fetchXRPToUSDRate(rippledSocket),
    enabled: isMainnet,
    refetchInterval: FETCH_INTERVAL_MILLIS,
  })

  useOnQueryError(error, (e) => Log.error(e))

  if (!isMainnet) {
    return 1.5 // This is chosen randomly for non-mainnet environments
  }

  return data ?? 0.0
}
