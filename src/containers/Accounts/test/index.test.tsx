import { mount } from 'enzyme'
import { Route } from 'react-router'
import i18n from '../../../i18n/testConfig'
import { Accounts } from '../index'
import { AccountHeader } from '../AccountHeader'
import { AccountTransactionTable } from '../AccountTransactionTable'
import mockAccountState from './mockAccountState.json'
import { QuickHarness, flushPromises } from '../../test/utils'
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

  const createWrapper = () =>
    mount(
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

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders static parts', async () => {
    mockedGetAccountState.mockImplementation(() =>
      Promise.resolve(mockAccountState),
    )

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find(AccountHeader).length).toBe(1)
    expect(wrapper.find(AccountTransactionTable).length).toBe(1)
    wrapper.find('.balance-selector button').simulate('click')
    wrapper.unmount()
  })
})
