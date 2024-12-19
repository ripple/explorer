import { mount } from 'enzyme'
import { Route } from 'react-router-dom'
import i18n from '../../../i18n/testConfig'
import { Token } from '../index'
import { TokenHeader } from '../TokenHeader'
import { TokenTransactionTable } from '../TokenTransactionTable'
import { flushPromises, QuickHarness } from '../../test/utils'
import { TOKEN_ROUTE } from '../../App/routes'
import mockAccount from '../../Accounts/test/mockAccountState.json'
import Mock = jest.Mock
import { getToken } from '../../../rippled'

jest.mock('../../../rippled', () => ({
  __esModule: true,
  getToken: jest.fn(),
}))

jest.mock('../../../rippled', () => ({
  __esModule: true,
  getToken: jest.fn(),
}))

describe('Token container', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

  const createWrapper = (getAccountImpl = () => new Promise(() => {})) => {
    ;(getToken as Mock).mockImplementation(getAccountImpl)
    return mount(
      <QuickHarness
        i18n={i18n}
        initialEntries={[`/token/USD.${TEST_ACCOUNT_ID}`]}
      >
        <Route path={TOKEN_ROUTE.path} element={<Token />} />
      </QuickHarness>,
    )
  }

  beforeEach(() => {
    jest.resetModules()
  })

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders static parts', async () => {
    const wrapper = createWrapper(() => Promise.resolve(mockAccount))
    await flushPromises()
    wrapper.update()
    expect(wrapper.find(TokenHeader).length).toBe(1)
    expect(wrapper.find(TokenTransactionTable).length).toBe(1)
    wrapper.unmount()
  })
})
