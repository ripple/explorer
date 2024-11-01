import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import moxios from 'moxios'
import WS from 'jest-websocket-mock'
import { Route } from 'react-router'
import i18n from '../../../i18n/testConfig'
import { Network } from '../index'
import mockValidators from './mockValidators.json'
import validationMessage from './mockValidation.json'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'
import { flushPromises, QuickHarness } from '../../test/utils'
import { NETWORK_ROUTE } from '../../App/routes'

const WS_URL = 'ws://localhost:1234'

describe('Validators Tab container', () => {
  let server
  let client
  const renderComponent = () =>
    render(
      <SocketContext.Provider value={client}>
        <QuickHarness i18n={i18n} initialEntries={['/network/validators']}>
          <Route path={NETWORK_ROUTE.path} element={<Network />} />
        </QuickHarness>
      </SocketContext.Provider>,
    )

  beforeEach(async () => {
    server = new WS(WS_URL, { jsonProtocol: true })
    client = new MockWsClient(WS_URL)
    await server.connected
    moxios.install()
  })

  afterEach(() => {
    cleanup()
    moxios.uninstall()
    server.close()
    client.close()
    WS.clean()
  })

  it('renders without crashing', async () => {
    renderComponent()
  })

  it('receives live validation', async (done) => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: mockValidators,
    })

    renderComponent()

    expect(screen.queryByTestId('validators')).toBeDefined()
    expect(screen.queryByTestId('stat').outerHTML).toBe(
      '<div class="stat" data-testid="stat"><span>validators_found: </span><span>0</span></div>',
    )
    expect(screen.queryByTestId('validators-table')).toBeDefined()

    server.send(validationMessage)
    await flushPromises()

    setTimeout(() => {
      expect(screen.queryByTestId('stat').outerHTML).toBe(
        '<div class="stat" data-testid="stat"><span>validators_found: </span><span>4<i> (unl: 2)</i></span></div>',
      )
      expect(screen.queryByTestId('validators .tooltip')).toBeNull()

      fireEvent.mouseOver(screen.queryAllByTestId('hexagon')[0])
      expect(
        screen.queryByTestId('validators-container .tooltip'),
      ).toBeDefined()
      expect(
        screen.queryByTestId('validators-container .tooltip .pubkey').outerHTML,
      ).toBe(
        '<div class="pubkey">n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR</div>',
      )
      fireEvent.mouseLeave(screen.queryByTestId('validators .hexagon')[0])
      expect(screen.queryByTestId('validators-container .tooltip')).toBeNull()
      expect(screen.queryByTestId('hexagons')).toBeDefined()
      expect(screen.queryByTestId('row')).toHaveLength(5)
      done()
    })
  })
})
