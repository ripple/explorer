import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18n from '../../../../i18n/testConfig'
import { AccountTransactionTable } from '../index'
import TEST_TRANSACTIONS_DATA from './mockTransactions.json'
import { getAccountTransactions } from '../../../../rippled'
import { flushPromises, QuickHarness } from '../../../test/utils'
import Mock = jest.Mock

jest.mock('../../../../rippled', () => ({
  __esModule: true,
  getAccountTransactions: jest.fn(),
}))

const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

describe('AccountTransactionsTable container', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  const renderComponent = (
    getAccountTransactionsImpl: () => Promise<any> = () =>
      new Promise(() => {}),
    state = { hasToken: false },
  ) => {
    ;(getAccountTransactions as Mock).mockImplementation(
      getAccountTransactionsImpl,
    )
    return render(
      <QuickHarness i18n={i18n}>
        <AccountTransactionTable
          accountId={TEST_ACCOUNT_ID}
          hasTokensColumn={state.hasToken}
        />
      </QuickHarness>,
    )
  }

  it('renders static parts', () => {
    const { container } = renderComponent()
    expect(container.querySelector('.transaction-table')).toBeInTheDocument()
  })

  it('renders loader when fetching data', () => {
    const { container } = renderComponent()
    expect(container.querySelector('.loader')).toBeInTheDocument()
  })

  it('renders dynamic content with transaction data', async () => {
    const { container } = renderComponent(() =>
      Promise.resolve(TEST_TRANSACTIONS_DATA),
    )

    await flushPromises()

    expect(container.querySelector('.col-token')).not.toBeInTheDocument()
    expect(container.querySelector('.load-more-btn')).toBeInTheDocument()
    expect(container.querySelector('.transaction-table')).toBeInTheDocument()
    expect(
      container.querySelector('.transaction-li.transaction-li-header'),
    ).toBeInTheDocument()
    expect(container.querySelectorAll('a')).toHaveLength(60)

    await userEvent.click(container.querySelector('.load-more-btn')!)
    expect(getAccountTransactions).toHaveBeenCalledWith(
      TEST_ACCOUNT_ID,
      undefined,
      '44922483.5',
      undefined,
      undefined,
    )
  })

  it('renders error message when request fails', async () => {
    const { container } = renderComponent(() => Promise.reject())

    await flushPromises()

    await waitFor(() => {
      expect(container.querySelector('.transaction-table')).toBeInTheDocument()
      expect(
        container.querySelector('.empty-transactions-message'),
      ).toHaveTextContent('get_account_transactions_failed')
      expect(container.querySelectorAll('a')).toHaveLength(0)
    })
  })

  it('renders dynamic content with transaction data and token column', async () => {
    const { container } = renderComponent(
      () => Promise.resolve(TEST_TRANSACTIONS_DATA),
      { hasToken: true },
    )

    await flushPromises()

    await waitFor(() => {
      expect(container.querySelectorAll('.col-token').length).toBeGreaterThan(0)
    })
    expect(container.querySelector('.load-more-btn')).toBeInTheDocument()
    expect(container.querySelector('.transaction-table')).toBeInTheDocument()
    expect(
      container.querySelector('.transaction-li.transaction-li-header'),
    ).toBeInTheDocument()
    expect(container.querySelectorAll('a')).toHaveLength(60)

    await userEvent.click(container.querySelector('.load-more-btn')!)
    expect(getAccountTransactions).toHaveBeenCalledWith(
      TEST_ACCOUNT_ID,
      undefined,
      '44922483.5',
      undefined,
      undefined,
    )
  })

  it('renders error message when request fails with token column', async () => {
    const { container } = renderComponent(() => Promise.reject())

    await flushPromises()

    await waitFor(() => {
      expect(container.querySelector('.transaction-table')).toBeInTheDocument()
      expect(
        container.querySelector('.empty-transactions-message'),
      ).toHaveTextContent('get_account_transactions_failed')
      expect(container.querySelectorAll('a')).toHaveLength(0)
    })
  })
})
