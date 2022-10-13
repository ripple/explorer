import React from 'react'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { QueryClientProvider } from 'react-query'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import i18n from '../../../../i18nTestConfig'
import { AccountTransactionTable } from '../index'
import TEST_TRANSACTIONS_DATA from './mockTransactions.json'
import { getAccountTransactions } from '../../../../rippled'
import { queryClient } from '../../../shared/QueryClient'

jest.mock('../../../../rippled', () => ({
  __esModule: true,
  getAccountTransactions: jest.fn(),
}))

const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve))
}

describe('AccountTransactionsTable container', () => {
  const createWrapper = (
    getAccountTransactionsImpl = () =>
      new Promise(
        () => {},
        () => {},
      ),
  ) => {
    getAccountTransactions.mockImplementation(getAccountTransactionsImpl)
    return mount(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Router>
            <AccountTransactionTable accountId={TEST_ACCOUNT_ID} />
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

  it('does not render loader if we have offline data', () => {
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

    expect(component.find('.load-more-btn').length).toBe(1)
    expect(component.find('.transaction-table').length).toBe(1)
    expect(component.find('.transaction-li.transaction-li-header').length).toBe(
      1,
    )
    expect(component.find(Link).length).toBe(40)
  })
})
