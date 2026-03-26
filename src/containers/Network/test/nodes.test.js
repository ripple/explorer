import { render, fireEvent, waitFor } from '@testing-library/react'
import moxios from 'moxios'
import { Route } from 'react-router-dom'
import i18n from '../../../i18n/testConfig'
import mockNodes from './mockNodes.json'
import NetworkContext from '../../shared/NetworkContext'
import countries from '../../../../public/countries.json'
import { QuickHarness } from '../../test/utils'
import { NODES_ROUTE } from '../../App/routes'
import { Nodes } from '../Nodes'

jest.mock('usehooks-ts', () => ({
  useWindowSize: () => ({
    width: 375,
    height: 600,
  }),
}))

describe('Nodes Page container', () => {
  const renderNodes = () =>
    render(
      <NetworkContext.Provider value="main">
        <QuickHarness i18n={i18n} initialEntries={['/network/nodes']}>
          <Route path={NODES_ROUTE.path} element={<Nodes />} />
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
    renderNodes()
  })

  it('renders all parts', async () => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/topology/nodes/main`, {
      status: 200,
      response: { nodes: mockNodes },
    })

    moxios.stubRequest(`/countries.json`, {
      status: 200,
      response: countries,
    })

    const { container } = renderNodes()

    expect(container.querySelectorAll('.nodes-map').length).toBe(1)
    expect(container.querySelector('.stat').outerHTML).toBe(
      '<div class="stat"></div>',
    )
    expect(container.querySelectorAll('.nodes-table').length).toBe(1)

    await waitFor(() => {
      expect(container.querySelector('.stat').outerHTML).toBe(
        '<div class="stat"><span>nodes_found: </span><span>3<i> (1 unmapped)</i></span></div>',
      )
    })

    expect(container.querySelectorAll('.nodes-map .tooltip').length).toBe(0)
    const nodeElement = container.querySelector('.nodes-map path.node')
    fireEvent.mouseOver(nodeElement)

    await waitFor(() => {
      expect(container.querySelectorAll('.nodes-map .tooltip').length).toBe(1)
    })
    expect(container.querySelector('.nodes-map .tooltip').outerHTML).toBe(
      '<g class="tooltip"><rect rx="2" ry="2" x="102.80776503073434" y="44.52072594490305" width="60" height="15"></rect><text x="104.80776503073434" y="56.52072594490305">1 nodes</text></g>',
    )

    fireEvent.mouseLeave(nodeElement)
    await waitFor(() => {
      expect(container.querySelectorAll('.nodes-map .tooltip').length).toBe(0)
    })

    expect(container.querySelectorAll('.nodes-map path.node').length).toBe(2)
    expect(container.querySelectorAll('.nodes-table table tr').length).toBe(4)
  })
})
