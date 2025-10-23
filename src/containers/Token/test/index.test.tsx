import { mount } from 'enzyme'
import { Route } from 'react-router-dom'
import i18n from '../../../i18n/testConfig'
import { Token } from '../index'
import { TokenHeader } from '../TokenHeader'
import { TokenTablePicker } from '../TokenTablePicker/TokenTablePicker'
import { flushPromises, QuickHarness } from '../../test/utils'
import { TOKEN_ROUTE } from '../../App/routes'
import Mock = jest.Mock
import getToken from '../api/token'
import { LOSToken } from '../../shared/losTypes'

jest.mock('../api/token', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('Token container', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

  const mockTokenData: LOSToken = {
    currency: 'USD',
    issuer_account: TEST_ACCOUNT_ID,
    issuer_name: 'Test Issuer',
    issuer_domain: 'https://example.com',
    icon: 'https://example.com/icon.png',
    price: '0.50',
    holders: 1000,
    trustlines: 5000,
    transfer_fee: 0.5,
    supply: '1000000',
    circ_supply: '800000',
    daily_volume: '50000',
    daily_trades: '1234',
    market_cap_usd: '400000',
    tvl_usd: '100000',
    asset_subclass: 'stablecoin',
    index: 0,
  }

  const createWrapper = (getTokenImpl = () => new Promise(() => {})) => {
    ;(getToken as Mock).mockImplementation(getTokenImpl)
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
    const wrapper = createWrapper(() => Promise.resolve(mockTokenData))
    await flushPromises()
    wrapper.update()
    expect(wrapper.find(TokenHeader).length).toBe(1)
    expect(wrapper.find(TokenTablePicker).length).toBe(1)
    wrapper.unmount()
  })
})
