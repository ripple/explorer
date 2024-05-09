import { cleanup, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import { TransactionTable } from '../TransactionTable'
import i18n from '../../../../../i18n/testConfig'
import mockTx from './mockTransactions.json'
import { queryClient } from '../../../QueryClient'

const loadMore = jest.fn()

describe('Transaction Table container', () => {
  afterEach(cleanup)
  const renderComponent = (
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
    renderComponent()
  })

  it('renders multi-page content', () => {
    renderComponent(mockTx.transactions, undefined, false, loadMore, false)

    expect(wrapper.find('.transaction-table').length).toBe(1)
    expect(wrapper.find('.upper').length).toBe(3)
    expect(wrapper.find('.details').length).toBe(2)
    expect(wrapper.find('.load-more-btn').length).toEqual(0)
  })

  it('renders single-page content', () => {
    renderComponent(mockTx.transactions, undefined, false, loadMore, true)
    expect(wrapper.find('.transaction-table').length).toBe(1)
    expect(wrapper.find('.upper').length).toBe(3)
    expect(wrapper.find('.details').length).toBe(2)
    expect(wrapper.find('.load-more-btn').length).toEqual(1)
  })

  it('renders without details', () => {
    renderComponent(mockTx.transactions, undefined, false, loadMore, true)
    expect(wrapper.find('.transaction-table').length).toBe(1)
    expect(wrapper.find('.upper').length).toBe(3)
    expect(wrapper.find('.details').length).toBe(2)
  })

  it('renders loader', () => {
    renderComponent(mockTx.transactions, undefined, true, loadMore, false)
    expect(wrapper.find('.loader').length).toBe(1)
  })

  it('renders empty message', () => {
    renderComponent([], undefined, false, loadMore, false)
    expect(wrapper.find('.empty-transactions-message').length).toBe(1)
  })
})
