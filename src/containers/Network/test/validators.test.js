import { mount } from 'enzyme'
import moxios from 'moxios'
import WS from 'jest-websocket-mock'
import { Route } from 'react-router'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../i18n/testConfig'
import mockValidators from './mockValidators.json'
import validationMessage from './mockValidation.json'
import SocketContext from '../../shared/SocketContext'
import NetworkContext from '../../shared/NetworkContext'
import MockWsClient from '../../test/mockWsClient'
import { QuickHarness } from '../../test/utils'
import { VALIDATORS_ROUTE } from '../../App/routes'
import { Validators } from '../Validators'
import { queryClient } from '../../shared/QueryClient'

const WS_URL = 'ws://localhost:1234'

describe('Validators Tab container', () => {
  let server
  let client

  const createWrapper = () =>
    mount(
      <SocketContext.Provider value={client}>
        <NetworkContext.Provider value="main">
          <QueryClientProvider client={queryClient}>
            <QuickHarness i18n={i18n} initialEntries={['/network/validators']}>
              <Route path={VALIDATORS_ROUTE.path} element={<Validators />} />
            </QuickHarness>
          </QueryClientProvider>
        </NetworkContext.Provider>
      </SocketContext.Provider>,
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

  it('displays validators from VHS API', (done) => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: { validators: mockValidators },
    })

    const wrapper = createWrapper()

    moxios.wait(() => {
      setTimeout(() => {
        wrapper.update()

        // Should show 4 validators from VHS with 2 in UNL
        expect(wrapper.find('.stat').text()).toEqual(
          'validators_found: 4 (unl: 2)',
        )

        // Should render hexagons visualization
        expect(wrapper.find('.hexagons').length).toBe(1)

        wrapper.unmount()
        done()
      }, 100)
    })
  })

  it('merges validators from both VHS API and WebSocket stream', (done) => {
    // Mock the VHS API response with 4 validators
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: { validators: mockValidators },
    })

    const wrapper = createWrapper()

    // Send a live validation message via WebSocket
    // This validator (n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR) is NOT in mockValidators
    server.send(validationMessage)

    // Wait for both VHS API and WebSocket data to be processed
    moxios.wait(() => {
      setTimeout(() => {
        wrapper.update()

        // Should show 5 validators total (4 from VHS + 1 new from WebSocket)
        // Note: The validation_public_key in mockValidation.json is different from all signing_keys in mockValidators.json
        expect(wrapper.find('.stat').text()).toEqual(
          'validators_found: 5 (unl: 2)',
        )

        // Should render hexagons with merged data
        expect(wrapper.find('.hexagons').length).toBe(1)

        // Should render validators table
        expect(wrapper.find('.validators-table').length).toBe(1)

        // Check table has 5 data rows (4 from VHS + 1 from WebSocket)
        const tableRows = wrapper.find('.validators-table table tbody tr')
        expect(tableRows.length).toBe(5)

        // Verify that the WebSocket validator is in the table
        const tableText = wrapper.find('.validators-table').text()
        expect(tableText).toContain(
          'n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR',
        )

        wrapper.unmount()
        done()
      }, 100)
    })
  })
})
