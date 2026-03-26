import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useAccountTransactions } from '../../hooks/useAccountTransactions'
import SocketContext from '../../../../shared/SocketContext'
import * as rippled from '../../../../../rippled'

jest.mock('../../../../../rippled')
jest.mock('../../../../shared/analytics', () => ({
  useAnalytics: () => ({
    trackException: jest.fn(),
  }),
}))

const mockedGetAccountTransactions = rippled.getAccountTransactions as jest.Mock

const createWrapper =
  (socket: any = {}, queryClient = new QueryClient()) =>
  ({ children }: { children: React.ReactNode }) => (
    <SocketContext.Provider value={socket}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SocketContext.Provider>
  )

describe('useAccountTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('fetches transactions successfully', async () => {
    const mockTransactions = [
      { hash: 'tx1', type: 'Payment' },
      { hash: 'tx2', type: 'Payment' },
    ]
    mockedGetAccountTransactions.mockResolvedValue({
      transactions: mockTransactions,
      marker: undefined,
    })

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const { result } = renderHook(
      () =>
        useAccountTransactions({
          account: 'rAccount123',
          tokenId: 'USD',
        }),
      { wrapper: createWrapper({}, queryClient) },
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data?.pages[0].transactions).toEqual(mockTransactions)
    expect(result.current.hasNextPage).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('returns hasNextPage true when marker exists', async () => {
    mockedGetAccountTransactions.mockResolvedValue({
      transactions: [{ hash: 'tx1' }],
      marker: 'next-page-marker',
    })

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const { result } = renderHook(
      () =>
        useAccountTransactions({
          account: 'rAccount123',
          tokenId: 'USD',
        }),
      { wrapper: createWrapper({}, queryClient) },
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.hasNextPage).toBe(true)
  })

  it('handles fetch error', async () => {
    mockedGetAccountTransactions.mockRejectedValue(new Error('Network error'))

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const { result } = renderHook(
      () =>
        useAccountTransactions({
          account: 'rAccount123',
          tokenId: 'USD',
        }),
      { wrapper: createWrapper({}, queryClient) },
    )

    await waitFor(() => expect(result.current.error).not.toBeNull())

    expect(result.current.error?.message).toBe(
      'get_account_transactions_failed',
    )
  })

  it('auto-fetches next page when current page has no matching transactions', async () => {
    // First page: no transactions, has marker
    // Second page: has transactions
    mockedGetAccountTransactions
      .mockResolvedValueOnce({
        transactions: [],
        marker: 'page-2-marker',
      })
      .mockResolvedValueOnce({
        transactions: [{ hash: 'tx1' }],
        marker: undefined,
      })

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const { result } = renderHook(
      () =>
        useAccountTransactions({
          account: 'rAccount123',
          tokenId: 'USD',
        }),
      { wrapper: createWrapper({}, queryClient) },
    )

    // Wait for first fetch
    await waitFor(() =>
      expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(1),
    )

    // Advance timer to trigger auto-fetch
    jest.advanceTimersByTime(200)

    await waitFor(() =>
      expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(2),
    )

    // Verify data from both pages is available
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data?.pages).toHaveLength(2)
    expect(result.current.data?.pages[0].transactions).toEqual([])
    expect(result.current.data?.pages[1].transactions).toEqual([
      { hash: 'tx1' },
    ])
  })
})
