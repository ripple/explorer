import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import moxios from 'moxios'
import { Route } from 'react-router-dom'
import i18n from '../../../i18n/testConfig'
import { Network } from '../index'
import mockNodes from './mockNodes.json'
import NetworkContext from '../../shared/NetworkContext'
import countries from '../../../../public/countries.json'
import { QuickHarness } from '../../test/utils'
import { NETWORK_ROUTE } from '../../App/routes'

jest.mock('usehooks-ts', () => ({
  useWindowSize: () => ({
    width: 375,
    height: 600,
  }),
}))

describe('Nodes Page container', () => {
  const renderComponent = () =>
    render(
      <NetworkContext.Provider value="main">
        <QuickHarness i18n={i18n} initialEntries={['/network/nodes']}>
          <Route path={NETWORK_ROUTE.path} element={<Network />} />
        </QuickHarness>
      </NetworkContext.Provider>,
    )

  const oldEnvs = process.env

  beforeEach(() => {
    moxios.install()
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
  })

  afterEach(() => {
    cleanup()
    moxios.uninstall()
    process.env = oldEnvs
  })

  it('renders without crashing', () => {
    renderComponent()
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

    renderComponent()

    expect(screen.queryByTestId('nodes-map')).toBeDefined()
    expect(screen.getByTestId('stat').outerHTML).toBe(
      '<div class="stat" data-testid="stat"></div>',
    )
    expect(screen.queryByTestId('nodes-table')).toBeDefined()
    setTimeout(() => {
      expect(screen.getByTestId('stat').outerHTML).toBe(
        '<div class="stat" data-testid="stat"><span>nodes_found: </span><span>3<i> (1 unmapped)</i></span></div>',
      )
      expect(screen.queryByTestId('tooltip')).toBeNull()
      // TODO: replace with userEvent
      fireEvent.mouseOver(screen.getAllByTestId('node')[0])
      expect(screen.queryByTestId('tooltip')).toBeDefined()
      expect(screen.getByTestId('tooltip').outerHTML).toBe(
        '<g class="tooltip" data-testid="tooltip"><rect rx="2" ry="2" x="102.80776503073434" y="44.52072594490305" width="60" height="15"></rect><text x="104.80776503073434" y="56.52072594490305">1 nodes</text></g>',
      )
      fireEvent.mouseLeave(screen.getAllByTestId('node')[0])
      expect(screen.queryByTestId('tooltip')).toBeNull()
      expect(screen.getAllByTestId('node')).toHaveLength(2)
      expect(screen.getAllByRole('row')).toHaveLength(4)
      done()
    })
  })
})
