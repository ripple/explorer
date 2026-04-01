import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import { TransactionTable } from '../TransactionTable'
import i18n from '../../../../../i18n/testConfig'
import mockTx from './mockTransactions.json'
import { queryClient } from '../../../QueryClient'

const loadMore = jest.fn()

describe('Transaction Table container', () => {
  const renderTransactionTable = (
    transactions = [],
    emptyMessage = undefined,
    loading = false,
    onLoadMore = loadMore,
    hasAdditionalResults = false,
  ) =>
    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <TransactionTable
              transactions={transactions}
              emptyMessage={emptyMessage}
              loading={loading}
              onLoadMore={onLoadMore}
              hasAdditionalResults={hasAdditionalResults}
            />
          </BrowserRouter>
        </I18nextProvider>
      </QueryClientProvider>,
    )

  it('renders without crashing', () => {
    renderTransactionTable()
  })

  it('renders multi-page content', () => {
    const { container } = renderTransactionTable(
      mockTx.transactions,
      undefined,
      false,
      loadMore,
      false,
    )

    expect(container.querySelectorAll('.transaction-table').length).toBe(1)
    expect(container.querySelectorAll('.upper').length).toBe(3)
    expect(container.querySelectorAll('.details').length).toBe(2)
    expect(container.querySelectorAll('.load-more-btn').length).toEqual(0)
  })

  it('renders single-page content', () => {
    const { container } = renderTransactionTable(
      mockTx.transactions,
      undefined,
      false,
      loadMore,
      true,
    )
    expect(container.querySelectorAll('.transaction-table').length).toBe(1)
    expect(container.querySelectorAll('.upper').length).toBe(3)
    expect(container.querySelectorAll('.details').length).toBe(2)
    expect(container.querySelectorAll('.load-more-btn').length).toEqual(1)
  })

  it('renders without details', () => {
    const { container } = renderTransactionTable(
      mockTx.transactions,
      undefined,
      false,
      loadMore,
      true,
    )
    expect(container.querySelectorAll('.transaction-table').length).toBe(1)
    expect(container.querySelectorAll('.upper').length).toBe(3)
    expect(container.querySelectorAll('.details').length).toBe(2)
  })

  it('renders loader', () => {
    const { container } = renderTransactionTable(
      mockTx.transactions,
      undefined,
      true,
      loadMore,
      false,
    )
    expect(container.querySelectorAll('.loader').length).toBe(1)
  })

  it('renders empty message', () => {
    const { container } = renderTransactionTable(
      [],
      undefined,
      false,
      loadMore,
      false,
    )
    expect(
      container.querySelectorAll('.empty-transactions-message').length,
    ).toBe(1)
  })
})
