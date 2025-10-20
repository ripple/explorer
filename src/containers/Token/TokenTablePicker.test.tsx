import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../i18n/testConfig'
import { TokenTablePicker } from './TokenTablePicker'
import TEST_TRANSACTIONS_DATA from '../Accounts/AccountTransactionTable/test/mockTransactions.json'

import { getAccountTransactions } from '../../rippled'
import { testQueryClient } from '../test/QueryClient'
import { flushPromises, V7_FUTURE_ROUTER_FLAGS } from '../test/utils'
import Mock = jest.Mock

jest.mock('../../rippled', () => ({
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

describe('TokenTablePicker container', () => {
  const createWrapper = (
    getAccountTransactionsImpl = () => new Promise(() => {}),
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
              holdersData={undefined}
              holdersPagination={{
                currentPage: 1,
                setCurrentPage: jest.fn(),
                pageSize: 20,
                total: 0,
              }}
              holdersLoading={false}
              dexTradesData={[]}
              dexTradesPagination={{
                currentPage: 1,
                setCurrentPage: jest.fn(),
                pageSize: 10,
                total: 0,
              }}
              dexTradesSorting={{
                sortField: 'timestamp',
                setSortField: jest.fn(),
                sortOrder: 'desc',
                setSortOrder: jest.fn(),
              }}
              dexTradesLoading={false}
              transfersData={[]}
              transfersPagination={{
                currentPage: 1,
                setCurrentPage: jest.fn(),
                pageSize: 10,
                total: 0,
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
})

