import { act, renderHook, waitFor } from '@testing-library/react'
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

// With fake timers, waitFor advances the clock itself and flushes pending
// promises between steps, so each 200ms auto-fetch delay elapses in order
const advanceThroughPages = (calls: number) =>
  waitFor(
    () => expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(calls),
    { timeout: calls * 1000 },
  )

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

  describe('with minResults', () => {
    // Pages with matches at the given indexes; every other page is empty
    const mockPages = (matchPages: number[], lastPage: number) =>
      mockedGetAccountTransactions.mockImplementation(
        async (_account: string, _tokenId: string, marker: string) => {
          const page = marker ? Number(marker) : 0
          return {
            transactions: matchPages.includes(page)
              ? [{ hash: `tx${page}a` }, { hash: `tx${page}b` }]
              : [],
            marker: page < lastPage ? String(page + 1) : undefined,
          }
        },
      )

    const renderMPTHook = () =>
      renderHook(
        () =>
          useAccountTransactions({
            account: 'rAccount123',
            tokenId: 'MPT',
            minResults: 4,
          }),
        { wrapper: createWrapper() },
      )

    it('auto-fetches past the attempt cap until minResults matches load', async () => {
      // 2 matches on page 0, 2 on page 12: the 4th match is past the cap of 10
      mockPages([0, 12, 20], 30)
      const { result } = renderMPTHook()

      await advanceThroughPages(13)
      await waitFor(() => expect(result.current.loading).toBe(false))
      jest.advanceTimersByTime(1000)

      expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(13)
      expect(result.current.hasNextPage).toBe(true)
    })

    it('loads the next minResults matches on load more', async () => {
      mockPages([0, 1, 15, 25], 30)
      const { result } = renderMPTHook()

      await advanceThroughPages(2)
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(2)

      act(() => {
        result.current.fetchNextPage()
      })
      await advanceThroughPages(26)
      await waitFor(() => expect(result.current.loading).toBe(false))
      jest.advanceTimersByTime(1000)

      // Skips the empty pages up to page 25, where the 8th match is
      expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(26)
      expect(
        result.current.data?.pages.flatMap((page: any) => page.transactions),
      ).toHaveLength(8)
    })

    it('resets the target when the token changes', async () => {
      mockPages([0, 1, 2, 3], 30)
      const { result, rerender } = renderHook(
        ({ tokenId }) =>
          useAccountTransactions({
            account: 'rAccount123',
            tokenId,
            minResults: 4,
          }),
        { wrapper: createWrapper(), initialProps: { tokenId: 'MPT1' } },
      )

      await advanceThroughPages(2)
      await waitFor(() => expect(result.current.loading).toBe(false))
      act(() => {
        result.current.fetchNextPage()
      })
      await advanceThroughPages(4)
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(4)

      rerender({ tokenId: 'MPT2' })
      await advanceThroughPages(6)
      await waitFor(() => expect(result.current.loading).toBe(false))
      jest.advanceTimersByTime(1000)

      // The new token loads 4 matches (2 pages), not the previous target of 8
      expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(6)
    })

    it('stops at the end of history with fewer than minResults matches', async () => {
      mockPages([3], 5)
      const { result } = renderMPTHook()

      await advanceThroughPages(6)
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(6)
      expect(result.current.hasNextPage).toBe(false)
    })

    it('keeps auto-fetching when loading state stays set across pages', async () => {
      // Real timers: a fetch's state and data can land in one render here,
      // which stalled the scan before the effect re-ran per page
      jest.useRealTimers()
      mockPages([], 5)
      const { result } = renderMPTHook()

      await waitFor(
        () => expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(6),
        { timeout: 4000 },
      )
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.hasNextPage).toBe(false)
    })
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

    await advanceThroughPages(11)
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
          minResults: 20,
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
