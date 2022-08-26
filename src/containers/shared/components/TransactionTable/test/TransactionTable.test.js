import React from 'react'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { TransactionTable } from '../TransactionTable'
import i18n from '../../../../../i18nTestConfig'
import mockTx from './mockTransactions.json'

const loadMore = jest.fn()

describe('Transaction Table container', () => {
  const createWrapper = (
    transactions = [],
    emptyMessage = undefined,
    loading = false,
    onLoadMore,
    hasAdditionalResults = false,
  ) =>
    mount(
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
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders multi-page content', () => {
    const wrapper = createWrapper(
      mockTx.transactions,
      undefined,
      false,
      loadMore,
      false,
    )

    expect(wrapper.find('.transaction-table').length).toBe(1)
    expect(wrapper.find('.upper').length).toBe(3)
    expect(wrapper.find('.details').length).toBe(2)
    expect(wrapper.find('.load-more-btn').length).toEqual(0)
    wrapper.unmount()
  })

  it('renders single-page content', () => {
    const wrapper = createWrapper(
      mockTx.transactions,
      undefined,
      false,
      loadMore,
      true,
    )
    expect(wrapper.find('.transaction-table').length).toBe(1)
    expect(wrapper.find('.upper').length).toBe(3)
    expect(wrapper.find('.details').length).toBe(2)
    expect(wrapper.find('.load-more-btn').length).toEqual(1)
    wrapper.unmount()
  })

  it('renders without details', () => {
    const wrapper = createWrapper(
      mockTx.transactions,
      undefined,
      false,
      loadMore,
      true,
    )
    expect(wrapper.find('.transaction-table').length).toBe(1)
    expect(wrapper.find('.upper').length).toBe(3)
    expect(wrapper.find('.details').length).toBe(2)
    wrapper.unmount()
  })

  it('renders loader', () => {
    const wrapper = createWrapper(
      mockTx.transactions,
      undefined,
      true,
      loadMore,
      false,
    )
    expect(wrapper.find('.loader').length).toBe(1)
    wrapper.unmount()
  })

  it('renders empty message', () => {
    const wrapper = createWrapper([], undefined, false, loadMore, false)
    expect(wrapper.find('.empty-transactions-message').length).toBe(1)
    wrapper.unmount()
  })
})
