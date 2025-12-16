import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import moxios from 'moxios'
import i18n from '../../../../../i18n/testConfig'
import { TablePicker } from '../../TablePicker'
import { testQueryClient } from '../../../../test/QueryClient'
import { V7_FUTURE_ROUTER_FLAGS } from '../../../../test/utils'

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

  const createWrapper = (
    getAccountTransactionsImpl = () => new Promise(() => {}),
    overrides: any = {},
  ) => {
    ;(getAccountTransactions as jest.Mock).mockImplementation(
      getAccountTransactionsImpl,
    )
    return mount(
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>
          <Router future={V7_FUTURE_ROUTER_FLAGS}>
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
    const wrapper = createWrapper()
    expect(wrapper.find('.token-transaction-table-container').length).toBe(1)
    wrapper.unmount()
  })

  it('renders loader when fetching data', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.loader').length).toBe(1)
    wrapper.unmount()
  })

  it('renders with holders data', () => {
    const setCurrentPage = jest.fn()
    const wrapper = createWrapper(() => new Promise(() => {}), {
      holdersData: mockHolders,
      holdersPagination: {
        currentPage: 1,
        setCurrentPage,
        pageSize: 20,
        total: 100,
      },
    })
    expect(wrapper.find('.token-transaction-table-container').length).toBe(1)
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
    expect(wrapper.find('.token-transaction-table-container').length).toBe(1)
    wrapper.unmount()
  })

  it('renders with loading states', () => {
    const wrapper = createWrapper(() => new Promise(() => {}), {
      holdersLoading: true,
      transfersLoading: true,
    })
    expect(wrapper.find('.token-transaction-table-container').length).toBe(1)
    wrapper.unmount()
  })
})
