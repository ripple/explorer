import { render, fireEvent, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router'
import { QueryClient, QueryClientProvider } from 'react-query'
import moxios from 'moxios'
import i18n from '../../../../../i18n/testConfig'
import { TablePicker } from '../../TablePicker'
import TEST_TRANSACTIONS_DATA from '../../../../Accounts/AccountTransactionTable/test/mockTransactions.json'

import { getAccountTransactions } from '../../../../../rippled'
import { testQueryClient } from '../../../../test/QueryClient'
import { flushPromises } from '../../../../test/utils'
import Mock = jest.Mock

jest.mock('../../../../../rippled', () => ({
  __esModule: true,
  getAccountTransactions: jest.fn(),
}))

const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'
const TEST_CURRENCY = 'abc'
const TEST_TOKEN_DATA = {
  currency: TEST_CURRENCY,
  issuer_account: TEST_ACCOUNT_ID,
  trustlines: 100,
  index: 0,
  price: '1.0',
}

const mockHoldersData = {
  holders: [
    {
      account: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      balance: 250000,
      percent: 25,
    },
  ],
  totalSupply: 1000000,
}

const mockDexTrades = [
  {
    hash: 'E3FE6EA3D48F0C2B639448020EA4F03D4F4F8FFDB243A852A0F59177921B4879',
    ledger: 12345,
    timestamp: 1609459200,
    from: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    to: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w',
    amount_in: {
      currency: 'USD',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      amount: '100',
    },
    amount_out: {
      currency: 'XRP',
      issuer: '',
      amount: '500',
    },
    rate: 5,
    type: 'orderBook',
  },
]

const mockTransfers = [
  {
    hash: 'E3FE6EA3D48F0C2B639448020EA4F03D4F4F8FFDB243A852A0F59177921B4879',
    ledger: 12345,
    action: 'send',
    timestamp: 1609459200,
    from: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    to: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w',
    amount: {
      currency: 'USD',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      value: '100',
    },
  },
]

describe('TablePicker container', () => {
  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  const renderTablePicker = (
    getAccountTransactionsImpl = () => new Promise(() => {}),
    overrides: any = {},
  ) => {
    ;(getAccountTransactions as Mock).mockImplementation(
      getAccountTransactionsImpl,
    )
    return render(
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>
          <Router>
            <TablePicker
              accountId={TEST_ACCOUNT_ID}
              currency={TEST_CURRENCY}
              xrpUSDRate="1.0"
              tokenData={TEST_TOKEN_DATA}
              holdersData={overrides.holdersData}
              holdersPagination={
                overrides.holdersPagination || {
                  currentPage: 1,
                  setCurrentPage: jest.fn(),
                  pageSize: 20,
                  total: 0,
                }
              }
              holdersLoading={overrides.holdersLoading || false}
              dexTradesData={overrides.dexTradesData || []}
              dexTradesPagination={
                overrides.dexTradesPagination || {
                  currentPage: 1,
                  setCurrentPage: jest.fn(),
                  pageSize: 10,
                  total: 0,
                }
              }
              dexTradesSorting={
                overrides.dexTradesSorting || {
                  sortField: 'timestamp',
                  setSortField: jest.fn(),
                  sortOrder: 'desc',
                  setSortOrder: jest.fn(),
                }
              }
              dexTradesLoading={overrides.dexTradesLoading || false}
              transfersData={overrides.transfersData || []}
              transfersPagination={
                overrides.transfersPagination || {
                  currentPage: 1,
                  setCurrentPage: jest.fn(),
                  pageSize: 10,
                  total: 0,
                }
              }
              transfersSorting={
                overrides.transfersSorting || {
                  sortField: 'timestamp',
                  setSortField: jest.fn(),
                  sortOrder: 'desc',
                  setSortOrder: jest.fn(),
                }
              }
              transfersLoading={overrides.transfersLoading || false}
              onRefreshDexTrades={overrides.onRefreshDexTrades}
              onRefreshTransfers={overrides.onRefreshTransfers}
            />
          </Router>
        </I18nextProvider>
      </QueryClientProvider>,
    )
  }

  it('renders static parts', () => {
    const { container } = renderTablePicker()
    expect(container.querySelectorAll('.transaction-table').length).toBe(1)
  })

  it('renders loader when fetching data', () => {
    const { container } = renderTablePicker()
    expect(container.querySelectorAll('.loader').length).toBe(1)
  })

  it('renders dynamic content with transaction data', async () => {
    const { container } = renderTablePicker(() =>
      Promise.resolve(TEST_TRANSACTIONS_DATA),
    )

    await flushPromises()
    await waitFor(() => {
      expect(container.querySelector('.load-more-btn')).toBeInTheDocument()
    })
    expect(container.querySelector('.transaction-table')).toBeInTheDocument()
    expect(
      container.querySelectorAll('.transaction-li.transaction-li-header')
        .length,
    ).toBe(1)
    expect(container.querySelectorAll('a').length).toBe(60)

    fireEvent.click(container.querySelector('.load-more-btn')!)
    expect(getAccountTransactions).toHaveBeenCalledWith(
      TEST_ACCOUNT_ID,
      TEST_CURRENCY,
      '44922483.5',
      50,
      undefined,
      true,
    )
  })

  it('renders error message when request fails', async () => {
    const { container } = renderTablePicker(() => Promise.reject())

    await flushPromises()
    // Two retries, 1 s and 2 s apart, before the error shows
    await waitFor(
      () => {
        expect(
          container.querySelector('.empty-transactions-message'),
        ).toBeInTheDocument()
      },
      { timeout: 5000 },
    )

    expect(container.querySelector('.load-more-btn')).not.toBeInTheDocument()
    expect(container.querySelector('.transaction-table')).toBeInTheDocument()
    expect(
      container.querySelector('.empty-transactions-message'),
    ).toHaveTextContent('get_account_transactions_failed')
    expect(container.querySelectorAll('a').length).toBe(0)
  }, 10000)

  it('renders with holders data', () => {
    const setCurrentPage = jest.fn()
    const { container } = renderTablePicker(() => new Promise(() => {}), {
      holdersData: mockHoldersData,
      holdersPagination: {
        currentPage: 1,
        setCurrentPage,
        pageSize: 20,
        total: 100,
      },
    })
    expect(container.querySelectorAll('.transaction-table').length).toBe(1)
  })

  it('renders with dex trades data', () => {
    const setSortField = jest.fn()
    const setSortOrder = jest.fn()
    const { container } = renderTablePicker(() => new Promise(() => {}), {
      dexTradesData: mockDexTrades,
      dexTradesPagination: {
        currentPage: 1,
        setCurrentPage: jest.fn(),
        pageSize: 10,
        total: 100,
        hasMore: true,
        hasPrevPage: false,
      },
      dexTradesSorting: {
        sortField: 'timestamp',
        setSortField,
        sortOrder: 'desc',
        setSortOrder,
      },
    })
    expect(container.querySelectorAll('.transaction-table').length).toBe(1)
  })

  it('renders with transfers data', () => {
    const setSortField = jest.fn()
    const setSortOrder = jest.fn()
    const { container } = renderTablePicker(() => new Promise(() => {}), {
      transfersData: mockTransfers,
      transfersPagination: {
        currentPage: 1,
        setCurrentPage: jest.fn(),
        pageSize: 10,
        total: 100,
        hasMore: true,
        hasPrevPage: false,
      },
      transfersSorting: {
        sortField: 'timestamp',
        setSortField,
        sortOrder: 'desc',
        setSortOrder,
      },
    })
    expect(container.querySelectorAll('.transaction-table').length).toBe(1)
  })

  it('renders with all data populated', () => {
    const { container } = renderTablePicker(() => new Promise(() => {}), {
      holdersData: mockHoldersData,
      dexTradesData: mockDexTrades,
      transfersData: mockTransfers,
      holdersPagination: {
        currentPage: 1,
        setCurrentPage: jest.fn(),
        pageSize: 20,
        total: 100,
      },
      dexTradesPagination: {
        currentPage: 1,
        setCurrentPage: jest.fn(),
        pageSize: 10,
        total: 100,
        hasMore: true,
        hasPrevPage: false,
      },
      transfersPagination: {
        currentPage: 1,
        setCurrentPage: jest.fn(),
        pageSize: 10,
        total: 100,
        hasMore: true,
        hasPrevPage: false,
      },
    })
    expect(container.querySelectorAll('.transaction-table').length).toBe(1)
  })

  it('renders with loading states', () => {
    const { container } = renderTablePicker(() => new Promise(() => {}), {
      holdersLoading: true,
      dexTradesLoading: true,
      transfersLoading: true,
    })
    expect(container.querySelectorAll('.transaction-table').length).toBe(1)
  })

  it('renders with refresh callbacks', () => {
    const onRefreshDexTrades = jest.fn()
    const onRefreshTransfers = jest.fn()
    const { container } = renderTablePicker(() => new Promise(() => {}), {
      onRefreshDexTrades,
      onRefreshTransfers,
    })
    expect(container.querySelectorAll('.transaction-table').length).toBe(1)
  })

  describe('scanning past non-matching history', () => {
    // Pages 0..lastPage with no matching transactions; the marker is the third
    // argument to getAccountTransactions
    const emptyPages =
      (lastPage: number) =>
      async (...args: any[]) => {
        const page = args[2] ? Number(args[2]) : 0
        return {
          transactions: [],
          marker: page < lastPage ? String(page + 1) : undefined,
        }
      }

    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('asks to load more when the page budget runs out with history left', async () => {
      const { container } = renderTablePicker(emptyPages(1000))

      await waitFor(
        () =>
          expect(
            container.querySelector('.empty-transactions-message'),
          ).toHaveTextContent('get_account_transactions_try'),
        { timeout: 20000 },
      )
      expect(getAccountTransactions).toHaveBeenCalledTimes(50)
    })

    it('reports no transactions at the end of history', async () => {
      const { container } = renderTablePicker(emptyPages(3))

      await waitFor(() =>
        expect(
          container.querySelector('.empty-transactions-message'),
        ).toHaveTextContent('no_transactions_message'),
      )
      expect(getAccountTransactions).toHaveBeenCalledTimes(4)
    })
  })

  describe('switching currency and back', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      ;(getAccountTransactions as Mock).mockImplementation(
        async (_account: string, _currency: string, marker: string) => ({
          transactions: [],
          marker: String((marker ? Number(marker) : 0) + 1),
        }),
      )
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    // The app's query defaults, with react-query's default 5-minute cache, so
    // the first currency's pages are still cached on the way back
    const appQueryClient = () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            retry: false,
          },
        },
      })

    // Keyed by token, as IOU/index.tsx does
    const renderPicker = (queryClient: QueryClient, currency: string) => (
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Router>
            <TablePicker
              key={`${currency}.${TEST_ACCOUNT_ID}`}
              accountId={TEST_ACCOUNT_ID}
              currency={currency}
              xrpUSDRate="1.0"
              tokenData={{ ...TEST_TOKEN_DATA, currency }}
              holdersPagination={{
                currentPage: 1,
                setCurrentPage: jest.fn(),
                pageSize: 20,
                total: 0,
              }}
              holdersLoading={false}
              dexTradesPagination={{
                currentPage: 1,
                setCurrentPage: jest.fn(),
                pageSize: 10,
                total: 0,
                hasMore: false,
                hasPrevPage: false,
              }}
              dexTradesSorting={{
                sortField: 'timestamp',
                setSortField: jest.fn(),
                sortOrder: 'desc',
                setSortOrder: jest.fn(),
              }}
              dexTradesLoading={false}
              transfersPagination={{
                currentPage: 1,
                setCurrentPage: jest.fn(),
                pageSize: 10,
                total: 0,
                hasMore: false,
                hasPrevPage: false,
              }}
              transfersSorting={{
                sortField: 'timestamp',
                setSortField: jest.fn(),
                sortOrder: 'desc',
                setSortOrder: jest.fn(),
              }}
              transfersLoading={false}
            />
          </Router>
        </I18nextProvider>
      </QueryClientProvider>
    )

    const callsFor = (currency: string) =>
      (getAccountTransactions as Mock).mock.calls.filter(
        (call: any[]) => call[1] === currency,
      ).length

    it('scans each currency in full and reuses the cache on return', async () => {
      const queryClient = appQueryClient()
      const { rerender } = render(renderPicker(queryClient, 'USD'))
      await waitFor(() => expect(callsFor('USD')).toBe(50), {
        timeout: 60000,
      })

      // A second currency gets its own full round
      rerender(renderPicker(queryClient, 'EUR'))
      await waitFor(() => expect(callsFor('EUR')).toBe(50), {
        timeout: 60000,
      })

      // Going back reuses the cached pages instead of refetching them
      rerender(renderPicker(queryClient, 'USD'))
      await waitFor(() => expect(callsFor('USD')).toBeGreaterThan(50), {
        timeout: 3000,
      }).catch(() => {})
      expect(callsFor('USD')).toBe(50)
    })
  })
})
