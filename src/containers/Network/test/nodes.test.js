import { mount } from 'enzyme'
import moxios from 'moxios'
import { MemoryRouter as Router, Route } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import { Network } from '../index'
import mockNodes from './mockNodes.json'
import { testQueryClient } from '../../test/QueryClient'
import NetworkContext from '../../shared/NetworkContext'
import countries from '../../../../public/countries.json'

jest.mock('usehooks-ts', () => ({
  useWindowSize: () => ({
    width: 375,
    height: 600,
  }),
}))

describe('Nodes Page container', () => {
  const createWrapper = () =>
    mount(
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>
          <NetworkContext.Provider value="main">
            <Router initialEntries={['/network/nodes']}>
              <Route path="/network/:tab" component={Network} />
            </Router>
          </NetworkContext.Provider>
        </I18nextProvider>
      </QueryClientProvider>,
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

  it('renders all parts', (done) => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/topology/nodes/main`, {
      status: 200,
      response: { nodes: mockNodes },
    })

    moxios.stubRequest(`/countries.json`, {
      status: 200,
      response: countries,
    })

    const wrapper = createWrapper()

    expect(wrapper.find('.nodes-map').length).toBe(1)
    expect(wrapper.find('.stat').html()).toBe('<div class="stat"></div>')
    expect(wrapper.find('.nodes-table').length).toBe(1)
    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('.stat').html()).toBe(
        '<div class="stat"><span>nodes_found: </span><span>3<i> (1 unmapped)</i></span></div>',
      )
      expect(wrapper.find('.nodes-map .tooltip').length).toBe(0)
      wrapper.find('.nodes-map path.node').first().simulate('mouseOver')
      wrapper.update()
      expect(wrapper.find('.nodes-map .tooltip').length).toBe(1)
      expect(wrapper.find('.nodes-map .tooltip').html()).toBe(
        '<g class="tooltip"><rect rx="2" ry="2" x="102.80776503073434" y="44.52072594490305" width="60" height="15"></rect><text x="104.80776503073434" y="56.52072594490305">1 nodes</text></g>',
      )
      wrapper.find('.nodes-map path.node').first().simulate('mouseLeave')
      wrapper.update()
      expect(wrapper.find('.nodes-map .tooltip').length).toBe(0)
      expect(wrapper.find('.nodes-map path.node').length).toBe(2)
      expect(wrapper.find('.nodes-table table tr').length).toBe(4)
      wrapper.unmount()
      done()
    })
  })
})
