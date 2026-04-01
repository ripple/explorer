import { render, fireEvent, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfig'
import { TokenTransactionTable } from '../index'
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

describe('TokenTransactionsTable container', () => {
  const renderTokenTransactionTable = (
    getAccountTransactionsImpl = () => new Promise(() => {}),
  ) => {
    ;(getAccountTransactions as Mock).mockImplementation(
      getAccountTransactionsImpl,
    )
    return render(
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>
          <Router future={V7_FUTURE_ROUTER_FLAGS}>
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
    const { container } = renderTokenTransactionTable()
    expect(container.querySelectorAll('.transaction-table').length).toBe(1)
  })

  it('renders loader when fetching data', () => {
    const { container } = renderTokenTransactionTable()
    expect(container.querySelectorAll('.loader').length).toBe(1)
  })

  it('renders dynamic content with transaction data', async () => {
    const { container } = renderTokenTransactionTable(() =>
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
      undefined,
      undefined,
    )
  })

  it('renders error message when request fails', async () => {
    const { container } = renderTokenTransactionTable(() => Promise.reject())

    await flushPromises()
    await waitFor(() => {
      expect(
        container.querySelector('.empty-transactions-message'),
      ).toBeInTheDocument()
    })

    expect(container.querySelector('.load-more-btn')).not.toBeInTheDocument()
    expect(container.querySelector('.transaction-table')).toBeInTheDocument()
    expect(
      container.querySelector('.empty-transactions-message'),
    ).toHaveTextContent('get_account_transactions_failed')
    expect(container.querySelectorAll('a').length).toBe(0)
  })
})
