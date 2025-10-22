import { mount } from 'enzyme'
import moxios from 'moxios'
import { Route } from 'react-router-dom'
import i18n from '../../../i18n/testConfigEnglish'
import { Tokens } from '..'
import NetworkContext from '../../shared/NetworkContext'
import { flushPromises, QuickHarness } from '../../test/utils'
import tokensData from './mock_data/tokens.json'
import { TOKENS_ROUTE } from '../../App/routes'

jest.mock('usehooks-ts', () => ({
  useWindowSize: () => ({
    width: 375,
    height: 600,
  }),
}))

describe('Tokens Page container', () => {
  const createWrapper = () =>
    mount(
      <NetworkContext.Provider value="main">
        <QuickHarness i18n={i18n} initialEntries={['/tokens']}>
          <Route path={TOKENS_ROUTE.path} element={<Tokens />} />
        </QuickHarness>
      </NetworkContext.Provider>,
    )

  const oldEnvs = process.env

  beforeEach(() => {
    moxios.install()
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
  })

  afterEach(() => {
    moxios.uninstall()
    process.env = oldEnvs
  })

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts', async () => {
    moxios.stubRequest('/api/v1/tokens', {
      status: 200,
      response: tokensData,
    })
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('.tokens-page').length).toBe(1)

    // Metrics
    const metrics = wrapper.find('.metric')

    expect(metrics.length).toBe(4)

    expect(metrics.at(0).find('.title').text()).toContain('# of Tokens')
    expect(metrics.at(0).find('.val').text()).toContain('2')

    expect(metrics.at(1).find('.title').text()).toContain('Market Cap')
    expect(metrics.at(1).find('.val').text()).toContain('$152.1M')

    expect(metrics.at(2).find('.title').text()).toContain(
      'DEX Traded Volume (24H)',
    )
    expect(metrics.at(2).find('.val').text()).toContain('$1.0M')

    expect(metrics.at(3).find('.title').text()).toContain('Stablecoin')
    expect(metrics.at(3).find('.val').text()).toContain('$25.9M')

    // Filter
    const filters = wrapper.find('.filter-field')

    expect(filters.length).toBe(2)

    expect(filters.at(0).find('.filter-label').text()).toContain('Stablecoin')

    expect(filters.at(1).find('.filter-label').text()).toContain('Wrapped')

    // Tokens Table
    expect(wrapper.find('.tokens-table').length).toBe(1)

    // Table Headers
    expect(wrapper.find('th.count').text()).toContain('#')
    expect(wrapper.find('th.name-col').text()).toContain('name')
    expect(wrapper.find('th.issuer').text()).toContain('Issuer')
    expect(wrapper.find('th.price').text()).toContain('Price')
    expect(wrapper.find('th[className*="24h"]').text()).toContain('24H')
    expect(wrapper.find('th.volume').text()).toContain('Volume')
    expect(wrapper.find('th.trades').text()).toContain('Trades')
    expect(wrapper.find('th.holders').text()).toContain('Holders')
    expect(wrapper.find('th.tvl').text()).toContain('TVL')
    expect(wrapper.find('th.market_cap').text()).toContain('Market Cap')

    // Table Rows
    // find all table rows excluding header
    const rows = wrapper.find('tr').filterWhere((n) => !n.find('th').exists())
    expect(rows).toHaveLength(2)

    const firstRow = rows.at(0)
    expect(firstRow.find('td.count').text()).toContain('1')
    expect(firstRow.find('td.name').text()).toContain('SOLO')
    expect(firstRow.find('td.issuer').text()).toContain('Sologenic')
    expect(firstRow.find('td.price').text()).toContain('$0.2')
    expect(firstRow.find('td[className*="24h"]').text()).toContain('0.75%')
    expect(firstRow.find('td.volume').text()).toContain('$138.7K')
    expect(firstRow.find('td.trades').text()).toContain('1,847')
    expect(firstRow.find('td.holders').text()).toContain('218.1K')
    expect(firstRow.find('td.tvl').text()).toContain('$1.1M')
    expect(firstRow.find('td.market-cap').text()).toContain('$91.2M')

    wrapper.unmount()
  })
})
