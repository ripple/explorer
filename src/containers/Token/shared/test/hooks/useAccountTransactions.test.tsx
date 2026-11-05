import { renderHook, waitFor } from '@testing-library/react'
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

  it('auto-fetches every page until the end when fetchUntilEnd is set', async () => {
    // Matches on pages 0 and 12, empty pages in between: more than the cap of 10
    mockedGetAccountTransactions.mockImplementation(
      async (_account: string, _tokenId: string, marker: string) => {
        const page = marker ? Number(marker) : 0
        return {
          transactions:
            page === 0 || page === 12 ? [{ hash: `tx${page}` }] : [],
          marker: page < 12 ? String(page + 1) : undefined,
        }
      },
    )

    const { result } = renderHook(
      () =>
        useAccountTransactions({
          account: 'rAccount123',
          tokenId: 'MPT',
          fetchUntilEnd: true,
        }),
      { wrapper: createWrapper() },
    )

    for (let page = 1; page <= 13; page += 1) {
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() =>
        expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(page),
      )
      jest.advanceTimersByTime(200)
    }

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(13)
    expect(result.current.hasNextPage).toBe(false)
    expect(
      result.current.data?.pages.flatMap((page: any) => page.transactions),
    ).toEqual([{ hash: 'tx0' }, { hash: 'tx12' }])
  })

  it('stops auto-fetching at the attempt cap by default', async () => {
    mockedGetAccountTransactions.mockImplementation(
      async (_account: string, _tokenId: string, marker: string) => ({
        transactions: [],
        marker: String((marker ? Number(marker) : 0) + 1),
      }),
    )

    const { result } = renderHook(
      () =>
        useAccountTransactions({
          account: 'rAccount123',
          tokenId: 'USD',
        }),
      { wrapper: createWrapper() },
    )

    for (let page = 1; page <= 11; page += 1) {
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() =>
        expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(page),
      )
      jest.advanceTimersByTime(200)
    }

    await waitFor(() => expect(result.current.loading).toBe(false))
    jest.advanceTimersByTime(1000)
    expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(11)
    expect(result.current.hasNextPage).toBe(true)
  })

  it('stops auto-fetching after a page fails', async () => {
    jest.useRealTimers()
    mockedGetAccountTransactions
      .mockResolvedValueOnce({ transactions: [], marker: 'page-2-marker' })
      .mockRejectedValue(new Error('slowDown'))

    const { result } = renderHook(
      () =>
        useAccountTransactions({
          account: 'rAccount123',
          tokenId: 'MPT',
          fetchUntilEnd: true,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.error).not.toBeNull())
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
    expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(2)
    expect(result.current.loading).toBe(false)
  })

  it('retries a failed page when retry is set', async () => {
    jest.useRealTimers()
    mockedGetAccountTransactions
      .mockRejectedValueOnce(new Error('slowDown'))
      .mockResolvedValueOnce({ transactions: [{ hash: 'tx1' }] })

    const { result } = renderHook(
      () =>
        useAccountTransactions({
          account: 'rAccount123',
          tokenId: 'MPT',
          retry: 1,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(
      () =>
        expect(result.current.data?.pages[0].transactions).toEqual([
          { hash: 'tx1' },
        ]),
      { timeout: 3000 },
    )
    expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(2)
    expect(result.current.error).toBeNull()
  })

  it('queries the P2P socket when useP2PSocket is set', async () => {
    const p2pSocket = { name: 'p2p' }
    const socket = { name: 'main', p2pSocket }
    mockedGetAccountTransactions.mockResolvedValue({ transactions: [] })

    renderHook(
      () =>
        useAccountTransactions({
          account: 'rAccount123',
          tokenId: 'MPT',
          useP2PSocket: true,
        }),
      { wrapper: createWrapper(socket) },
    )

    await waitFor(() =>
      expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(1),
    )
    expect(mockedGetAccountTransactions.mock.calls[0][4]).toBe(p2pSocket)
  })

  it('falls back to the main socket when no P2P socket is configured', async () => {
    const socket = { name: 'main', p2pSocket: undefined }
    mockedGetAccountTransactions.mockResolvedValue({ transactions: [] })

    renderHook(
      () =>
        useAccountTransactions({
          account: 'rAccount123',
          tokenId: 'MPT',
          useP2PSocket: true,
        }),
      { wrapper: createWrapper(socket) },
    )

    await waitFor(() =>
      expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(1),
    )
    expect(mockedGetAccountTransactions.mock.calls[0][4]).toBe(socket)
  })
})
