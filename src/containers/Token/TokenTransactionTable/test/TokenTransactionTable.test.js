import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfig'
import { TokenTransactionTable } from '../index'
import TEST_TRANSACTIONS_DATA from '../../../Accounts/AccountTransactionTable/test/mockTransactions.json'

import { getAccountTransactions } from '../../../../rippled'
import { testQueryClient } from '../../../test/QueryClient'
import { flushPromises } from '../../../test/utils'

jest.mock('../../../../rippled', () => ({
  __esModule: true,
  getAccountTransactions: jest.fn(),
}))

const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'
const TEST_CURRENCY = 'abc'

describe('TokenTransactionsTable container', () => {
  const createWrapper = (
    getAccountTransactionsImpl = () =>
      new Promise(
        () => {},
        () => {},
      ),
  ) => {
    getAccountTransactions.mockImplementation(getAccountTransactionsImpl)
    return mount(
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>
          <Router>
            <TokenTransactionTable
              accountId={TEST_ACCOUNT_ID}
              currency={TEST_CURRENCY}
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
    expect(component.find(Link).length).toBe(40)

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
