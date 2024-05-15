import { mount } from 'enzyme'
import { Route } from 'react-router-dom'
import i18n from '../../../i18n/testConfig'
import Token from '../index'
import TokenHeader from '../TokenHeader'
import { TokenTransactionTable } from '../TokenTransactionTable'
import mockAccountState from '../../Accounts/test/mockAccountState.json'
import { QuickHarness, flushPromises } from '../../test/utils'
import { TOKEN_ROUTE } from '../../App/routes'

import { getToken } from '../../../rippled'
import Mock = jest.Mock

jest.mock('../../../rippled', () => ({
  __esModule: true,
  getToken: jest.fn(),
}))

const mockedGetToken = getToken as Mock

describe('Token container', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

  const createWrapper = () =>
    mount(
      <QuickHarness
        i18n={i18n}
        initialEntries={[`/token/USD.${TEST_ACCOUNT_ID}`]}
      >
        <Route path={TOKEN_ROUTE.path} element={<Token error="" />} />
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
    mockedGetToken.mockImplementation(() => Promise.resolve(mockAccountState))

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find(TokenHeader).length).toBe(1)
    expect(wrapper.find(TokenTransactionTable).length).toBe(1)
    wrapper.unmount()
  })
})
