import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfig'
import { TokenTablePicker } from '../TokenTablePicker'
import TEST_TRANSACTIONS_DATA from '../../../Accounts/AccountTransactionTable/test/mockTransactions.json'

import { getAccountTransactions } from '../../../../rippled'
import { testQueryClient } from '../../../test/QueryClient'
import { flushPromises, V7_FUTURE_ROUTER_FLAGS } from '../../../test/utils'
import Mock = jest.Mock

jest.mock('../../../../rippled', () => ({
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

describe('TokenTablePicker container', () => {
  const createWrapper = (
    getAccountTransactionsImpl = () => new Promise(() => {}),
    overrides: any = {},
  ) => {
    ;(getAccountTransactions as Mock).mockImplementation(
      getAccountTransactionsImpl,
    )
    return mount(
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>
          <Router future={V7_FUTURE_ROUTER_FLAGS}>
            <TokenTablePicker
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
    const wrapper = createWrapper()
    expect(wrapper.find('.transaction-table').length).toBe(1)
    wrapper.unmount()
  })

  it('renders loader when fetching data', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.loader').length).toBe(1)
    wrapper.unmount()
  })

  it('renders dynamic content with transaction data', async () => {
    const component = createWrapper(() =>
      Promise.resolve(TEST_TRANSACTIONS_DATA),
    )

    await flushPromises()
    component.update()
    expect(component.find('.load-more-btn')).toExist()
    expect(component.find('.transaction-table')).toExist()
    expect(component.find('.transaction-li.transaction-li-header').length).toBe(
      1,
    )
    expect(component.find(Link).length).toBe(60)

    component.find('.load-more-btn').simulate('click')
    expect(getAccountTransactions).toHaveBeenCalledWith(
      TEST_ACCOUNT_ID,
      TEST_CURRENCY,
      '44922483.5',
      undefined,
      undefined,
    )
    component.unmount()
  })

  it('renders error message when request fails', async () => {
    const component = createWrapper(() => Promise.reject())

    await flushPromises()
    component.update()

    expect(component.find('.load-more-btn')).not.toExist()
    expect(component.find('.transaction-table')).toExist()
    expect(component.find('.empty-transactions-message')).toHaveText(
      'get_account_transactions_failed',
    )
    expect(component.find(Link).length).toBe(0)
    component.unmount()
  })

  it('renders with holders data', () => {
    const setCurrentPage = jest.fn()
    const wrapper = createWrapper(() => new Promise(() => {}), {
      holdersData: mockHoldersData,
      holdersPagination: {
        currentPage: 1,
        setCurrentPage,
        pageSize: 20,
        total: 100,
      },
    })
    expect(wrapper.find('.transaction-table').length).toBe(1)
    wrapper.unmount()
  })

  it('renders with dex trades data', () => {
    const setSortField = jest.fn()
    const setSortOrder = jest.fn()
    const wrapper = createWrapper(() => new Promise(() => {}), {
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
    expect(wrapper.find('.transaction-table').length).toBe(1)
    wrapper.unmount()
  })

  it('renders with transfers data', () => {
    const setSortField = jest.fn()
    const setSortOrder = jest.fn()
    const wrapper = createWrapper(() => new Promise(() => {}), {
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
    expect(wrapper.find('.transaction-table').length).toBe(1)
    wrapper.unmount()
  })

  it('renders with all data populated', () => {
    const wrapper = createWrapper(() => new Promise(() => {}), {
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
    expect(wrapper.find('.transaction-table').length).toBe(1)
    wrapper.unmount()
  })

  it('renders with loading states', () => {
    const wrapper = createWrapper(() => new Promise(() => {}), {
      holdersLoading: true,
      dexTradesLoading: true,
      transfersLoading: true,
    })
    expect(wrapper.find('.transaction-table').length).toBe(1)
    wrapper.unmount()
  })

  it('renders with refresh callbacks', () => {
    const onRefreshDexTrades = jest.fn()
    const onRefreshTransfers = jest.fn()
    const wrapper = createWrapper(() => new Promise(() => {}), {
      onRefreshDexTrades,
      onRefreshTransfers,
    })
    expect(wrapper.find('.transaction-table').length).toBe(1)
    wrapper.unmount()
  })
})
