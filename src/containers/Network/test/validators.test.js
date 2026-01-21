import { render, waitFor, screen } from '@testing-library/react'
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

  const renderValidators = () =>
    render(
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
    renderValidators()
  })

  it('displays validators from VHS API', async () => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: { validators: mockValidators },
    })

    const { container } = renderValidators()

    await waitFor(() => {
      expect(container.querySelector('.stat').textContent).toEqual(
        'validators_found: 4 (unl: 2)',
      )
    })

    expect(container.querySelectorAll('.hexagons').length).toBe(1)
  })

  it('merges validators from both VHS API and WebSocket stream', async () => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: { validators: mockValidators },
    })

    const { container } = renderValidators()

    server.send(validationMessage)

    await waitFor(() => {
      expect(container.querySelector('.stat').textContent).toEqual(
        'validators_found: 5 (unl: 2)',
      )
    })

    expect(container.querySelectorAll('.hexagons').length).toBe(1)
    expect(container.querySelectorAll('.validators-table').length).toBe(1)

    const tableRows = container.querySelectorAll(
      '.validators-table table tbody tr',
    )
    expect(tableRows.length).toBe(5)

    expect(
      screen.getByText('n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR'),
    ).toBeInTheDocument()
  })
})
