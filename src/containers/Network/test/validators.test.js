import { mount } from 'enzyme'
import moxios from 'moxios'
import WS from 'jest-websocket-mock'
import { MemoryRouter as Router, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../i18n/testConfig'
import { Network } from '../index'
import mockValidators from './mockValidators.json'
import validationMessage from './mockValidation.json'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'
import { testQueryClient } from '../../test/QueryClient'

const WS_URL = 'ws://localhost:1234'

describe('Validators Tab container', () => {
  let server
  let client
  const createWrapper = () =>
    mount(
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>
          <SocketContext.Provider value={client}>
            <Router initialEntries={['/network/validators']}>
              <Route path="/network/:tab" component={Network} />
            </Router>
          </SocketContext.Provider>
        </I18nextProvider>
      </QueryClientProvider>,
    )

  beforeEach(async () => {
    server = new WS(WS_URL, { jsonProtocol: true })
    client = new MockWsClient(WS_URL)
    await server.connected
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
    server.close()
    client.close()
    WS.clean()
  })

  it('renders without crashing', async () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('receives live validation', async () => {
    const wrapper = createWrapper()

    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: mockValidators,
    })

    expect(wrapper.find('.validators').length).toBe(1)
    expect(wrapper.find('.stat').html()).toBe(
      '<div class="stat"><span>validators_found: </span><span>0</span></div>',
    )
    expect(wrapper.find('.validators-table').length).toBe(1)

    server.send(validationMessage)

    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('.stat').html()).toBe(
        '<div class="stat"><span>validators_found: </span><span>4<i> (unl: 2)</i></span></div>',
      )
      expect(wrapper.find('.validators .tooltip').length).toBe(0)

      wrapper.find('.validators .hexagon').first().simulate('mouseOver')
      wrapper.update()
      expect(wrapper.find('.validators-container .tooltip').length).toBe(1)
      expect(
        wrapper.find('.validators-container .tooltip .pubkey').html(),
      ).toBe(
        '<div class="pubkey">n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR</div>',
      )
      wrapper.find('.validators .hexagon').first().simulate('mouseLeave')
      wrapper.update()
      expect(wrapper.find('.validators-container .tooltip').length).toBe(0)
      expect(wrapper.find('.validators .hexagons').length).toBe(1)
      expect(wrapper.find('.validators-table table tr').length).toBe(5)
      wrapper.unmount()
    })
  })
})
