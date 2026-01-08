import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { Route } from 'react-router'
import userEvent from '@testing-library/user-event'
import i18n from '../../../i18n/testConfig'
import { Accounts } from '../index'
import mockAccountState from './mockAccountState.json'
import { QuickHarness } from '../../test/utils'
import { ACCOUNT_ROUTE } from '../../App/routes'
import { getAccountState } from '../../../rippled'
import Mock = jest.Mock

jest.mock('../../../rippled', () => ({
  __esModule: true,
  getAccountState: jest.fn(),
  getAccountTransactions: jest.fn(() => []),
}))

jest.mock('../AccountHeader', () => ({
  __esModule: true,
  default: () => <div data-testid="account-header">Account Header</div>,
}))

jest.mock('../AccountSummary', () => ({
  __esModule: true,
  AccountSummary: () => (
    <div data-testid="account-summary">Account Summary</div>
  ),
}))

jest.mock('../AccountAsset', () => ({
  __esModule: true,
  default: () => <div data-testid="account-asset">Account Asset</div>,
}))

jest.mock('../AccountTransactionTable', () => ({
  __esModule: true,
  AccountTransactionTable: () => (
    <div data-testid="account-transaction-table">Account Transaction Table</div>
  ),
}))

const mockedGetAccountState = getAccountState as Mock

describe('Account container', () => {
  const TEST_ACCOUNT_ID = 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM'

  const renderComponent = () =>
    render(
      <QuickHarness
        i18n={i18n}
        initialEntries={[`/accounts/${TEST_ACCOUNT_ID}`]}
      >
        <Route path={ACCOUNT_ROUTE.path} element={<Accounts />} />
      </QuickHarness>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders static parts', async () => {
    mockedGetAccountState.mockImplementation(() =>
      Promise.resolve(mockAccountState),
    )

    renderComponent()

    await waitFor(() => {
      expect(screen.getByTestId('account-header')).toBeInTheDocument()
      expect(screen.getByTestId('account-summary')).toBeInTheDocument()
      expect(screen.getByTestId('account-asset')).toBeInTheDocument()
      expect(
        screen.getByTestId('account-transaction-table'),
      ).toBeInTheDocument()
    })
  })
})
