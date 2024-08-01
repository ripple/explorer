import { cleanup, fireEvent, render, screen } from '@testing-library/react'
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

  afterEach(cleanup)

  const renderComponent = (
    getAccountTransactionsImpl: () => Promise<any> = () =>
      new Promise(() => {}),
    currencySelected: string = '',
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
          currencySelected={currencySelected}
        />
      </QuickHarness>,
    )
  }

  it('renders static parts', () => {
    renderComponent()
    expect(screen.getAllByTitle('transaction-table')).toHaveLength(1)
  })

  it('renders loader when fetching data', () => {
    renderComponent()
    expect(screen.getAllByTitle('loader')).toHaveLength(1)
  })

  it('renders dynamic content with transaction data', async () => {
    renderComponent(() => Promise.resolve(TEST_TRANSACTIONS_DATA))

    await flushPromises()

    expect(screen.queryByTitle('col-token')).toBeNull()
    expect(screen.getAllByRole('button').length).toBe(1)
    expect(screen.getAllByTitle('transaction-table')).toHaveLength(1)
    expect(screen.getAllByRole('link')).toHaveLength(60)

    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(getAccountTransactions).toHaveBeenCalledWith(
      TEST_ACCOUNT_ID,
      undefined,
      '44922483.5',
      undefined,
      undefined,
    )
  })

  it('renders error message when request fails', async () => {
    renderComponent(() => Promise.reject())

    await flushPromises()

    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getAllByTitle('transaction-table')).toBeDefined()
    expect(screen.queryByText('get_account_transactions_failed')).toBeDefined()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('renders try loading more message when no filtered results show but there is a marker', async () => {
    renderComponent(() => Promise.resolve(TEST_TRANSACTIONS_DATA), 'EUR')

    await flushPromises()

    expect(screen.getByRole('button')).toBeDefined()
    expect(screen.getAllByTitle('transaction-table')).toBeDefined()
    expect(screen.queryByText('get_account_transactions_try')).toBeDefined()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('renders dynamic content with transaction data and token column', async () => {
    renderComponent(() => Promise.resolve(TEST_TRANSACTIONS_DATA), undefined, {
      hasToken: true,
    })

    await flushPromises()

    expect(screen.queryAllByTitle('col-token').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button').length).toBe(1)
    expect(screen.getAllByTitle('transaction-table').length).toBe(1)
    expect(screen.getAllByRole('link')).toHaveLength(60)

    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(getAccountTransactions).toHaveBeenCalledWith(
      TEST_ACCOUNT_ID,
      undefined,
      '44922483.5',
      undefined,
      undefined,
    )
  })

  it('renders try loading more message when no filtered results show but there is a marker', async () => {
    renderComponent(() => Promise.resolve(TEST_TRANSACTIONS_DATA), 'EUR')

    await flushPromises()

    expect(screen.getByRole('button')).toBeDefined()
    expect(screen.getByTitle('transaction-table')).toBeDefined()
    expect(screen.queryByText('get_account_transactions_try')).toBeDefined()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })
})
