import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useXRPToUSDRate } from '../useXRPToUSDRate'
import SocketContext from '../../SocketContext'
import * as rippled from '../../../../rippled/lib/rippled'
import Log from '../../log'

jest.mock('../../../../rippled/lib/rippled')
jest.mock('../../log')

const mockedGetAccountLines = rippled.getAccountLines as jest.Mock

const createWrapper =
  (socket: any = {}, queryClient = new QueryClient()) =>
  ({ children }: { children: React.ReactNode }) => (
    <SocketContext.Provider value={socket}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SocketContext.Provider>
  )

describe('useXRPToUSDRate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.VITE_ENVIRONMENT = 'mainnet'
  })

  it('returns 0.0 if no lines available', async () => {
    mockedGetAccountLines.mockResolvedValue({ lines: [] })
    const { result } = renderHook(() => useXRPToUSDRate(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current).toBe(0.0))
  })

  it('returns 1.5 if not mainnet', () => {
    process.env.VITE_ENVIRONMENT = 'dev'
    const { result } = renderHook(() => useXRPToUSDRate(), {
      wrapper: createWrapper(),
    })
    expect(result.current).toBe(1.5)
  })

  it('fetches XRP/USD rate if mainnet', async () => {
    mockedGetAccountLines.mockResolvedValue({ lines: [{ limit: 2.3 }] })
    const { result } = renderHook(() => useXRPToUSDRate(), {
      wrapper: createWrapper({}),
    })
    await waitFor(() => expect(result.current).toBe(2.3))
  })

  it('falls back to last successful rate on error', async () => {
    mockedGetAccountLines
      .mockResolvedValueOnce({ lines: [{ limit: 2.1 }] })
      .mockRejectedValueOnce(new Error('network error'))

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: 0 } },
    })
    const { result } = renderHook(() => useXRPToUSDRate(), {
      wrapper: createWrapper({}, queryClient),
    })

    // First fetch succeeds
    await waitFor(() => expect(result.current).toBe(2.1))

    // Force useQuery to refetch
    queryClient.invalidateQueries('XRPToUSDRate')

    await waitFor(() => expect(result.current).toBe(2.1))
    expect(Log.error).toHaveBeenCalledTimes(1)
  })
})
