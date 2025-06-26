import { cleanup, render, screen } from '@testing-library/react'
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
    jest.resetModules()
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
    expect(screen.getByTitle('account-header')).toBeDefined()
    expect(screen.getByTitle('transaction-table')).toBeDefined()
    userEvent.click(screen.getByRole('button'))
  })
})
