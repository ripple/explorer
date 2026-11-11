import { render, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router'
import { QueryClient, QueryClientProvider } from 'react-query'
import moxios from 'moxios'
import i18n from '../../../../../i18n/testConfig'
import { TablePicker } from '../../TablePicker'
import { testQueryClient } from '../../../../test/QueryClient'

import { getAccountTransactions } from '../../../../../rippled'

jest.mock('../../../../../rippled', () => ({
  __esModule: true,
  getAccountTransactions: jest.fn(),
}))

const TEST_MPT_ID = '00000004A407AF5856CCF3C42619DAA925813FC955C72983'
const TEST_ISSUER = 'rTestIssuer123456789012345678901234'

const mockHolders = [
  {
    rank: 1,
    account: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    balance: '250000',
    percent: 25,
    value_usd: null,
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
      currency: TEST_MPT_ID,
      issuer: TEST_ISSUER,
      value: '100',
    },
  },
]

describe('MPT TablePicker container', () => {
  beforeEach(() => {
    moxios.install()
    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  const renderComponent = (
    getAccountTransactionsImpl = () => new Promise(() => {}),
    overrides: any = {},
  ) => {
    ;(getAccountTransactions as jest.Mock).mockImplementation(
      getAccountTransactionsImpl,
    )
    return render(
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>
          <Router>
            <TablePicker
              mptIssuanceId={TEST_MPT_ID}
              issuer={TEST_ISSUER}
              assetScale={overrides.assetScale ?? 2}
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
              transfersData={overrides.transfersData || []}
              transfersPagination={
                overrides.transfersPagination || {
                  currentPage: 1,
                  setCurrentPage: jest.fn(),
                  pageSize: 10,
                  total: 0,
                  hasMore: false,
                  hasPrevPage: false,
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
              onRefreshTransfers={overrides.onRefreshTransfers}
            />
          </Router>
        </I18nextProvider>
      </QueryClientProvider>,
    )
  }

  it('renders transaction table container', () => {
    const { container } = renderComponent()
    expect(
      container.querySelectorAll('.token-transaction-table-container'),
    ).toHaveLength(1)
  })

  it('renders loader when fetching data', () => {
    const { container } = renderComponent()
    expect(container.querySelectorAll('.loader')).toHaveLength(1)
  })

  it('renders with holders data', () => {
    const setCurrentPage = jest.fn()
    const { container } = renderComponent(() => new Promise(() => {}), {
      holdersData: mockHolders,
      holdersPagination: {
        currentPage: 1,
        setCurrentPage,
        pageSize: 20,
        total: 100,
      },
    })
    expect(
      container.querySelectorAll('.token-transaction-table-container'),
    ).toHaveLength(1)
  })

  it('renders with transfers data', () => {
    const setSortField = jest.fn()
    const setSortOrder = jest.fn()
    const { container } = renderComponent(() => new Promise(() => {}), {
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
    expect(
      container.querySelectorAll('.token-transaction-table-container'),
    ).toHaveLength(1)
  })

  it('renders with loading states', () => {
    const { container } = renderComponent(() => new Promise(() => {}), {
      holdersLoading: true,
      transfersLoading: true,
    })
    expect(
      container.querySelectorAll('.token-transaction-table-container'),
    ).toHaveLength(1)
  })

  describe('empty transactions message', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('asks to load more when the page budget runs out with history left', async () => {
      const { container } = renderComponent(async () => ({
        transactions: [],
        marker: 'more',
      }))

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
      const { container } = renderComponent(async () => ({
        transactions: [],
        marker: undefined,
      }))

      await waitFor(() =>
        expect(
          container.querySelector('.empty-transactions-message'),
        ).toHaveTextContent('no_transactions_message'),
      )
    })
  })

  describe('returning to an MPT already viewed', () => {
    const MPT_A = '00000001A407AF5856CCF3C42619DAA925813FC955C72983'
    const MPT_B = '00000002A407AF5856CCF3C42619DAA925813FC955C72983'

    beforeEach(() => {
      jest.useFakeTimers()
      ;(getAccountTransactions as jest.Mock).mockImplementation(
        async (_account: string, _tokenId: string, marker: string) => ({
          transactions: [],
          marker: String((marker ? Number(marker) : 0) + 1),
        }),
      )
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    // The app's query defaults, with react-query's default 5-minute cache, so
    // MPT A's pages are still cached when the visitor comes back to it
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

    const renderPicker = (
      queryClient: QueryClient,
      id: string,
      key: string,
    ) => (
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Router>
            <TablePicker
              key={key}
              mptIssuanceId={id}
              issuer={TEST_ISSUER}
              assetScale={0}
              holdersPagination={{
                currentPage: 1,
                setCurrentPage: jest.fn(),
                pageSize: 20,
                total: 0,
              }}
              holdersLoading={false}
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

    // View A for a full round, then B, then return to A, keying the table by
    // MPT as MPT/index.tsx does. Returns the requests made after returning to A.
    const visitAThenBThenA = async () => {
      const queryClient = appQueryClient()
      const ui = (id: string) => renderPicker(queryClient, id, id)
      const { rerender } = render(ui(MPT_A))
      await waitFor(
        () => expect(getAccountTransactions).toHaveBeenCalledTimes(50),
        {
          timeout: 60000,
        },
      )
      rerender(ui(MPT_B))
      await waitFor(
        () => expect(getAccountTransactions).toHaveBeenCalledTimes(100),
        {
          timeout: 60000,
        },
      )
      rerender(ui(MPT_A))
      await waitFor(
        () =>
          expect(
            (getAccountTransactions as jest.Mock).mock.calls.length,
          ).toBeGreaterThan(149),
        { timeout: 3000 },
      ).catch(() => {})
      return (getAccountTransactions as jest.Mock).mock.calls.length - 100
    }

    it('reuses the cached pages instead of refetching them', async () => {
      expect(await visitAThenBThenA()).toBe(0)
    })
  })
})
