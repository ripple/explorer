import { render, waitFor } from '@testing-library/react'
import moxios from 'moxios'
import { Route } from 'react-router-dom'
import i18n from '../../../i18n/testConfigEnglish'
import { VotingTab } from '../VotingTab'
import { QuickHarness } from '../../test/utils'
import validator from './mock_data/validator.json'
import amendments from './mock_data/amendments.json'
import NetworkContext from '../../shared/NetworkContext'
import { VALIDATOR_ROUTE } from '../../App/routes'
import { buildPath } from '../../shared/routing'

jest.mock('usehooks-ts', () => ({
  useWindowSize: () => ({
    width: 375,
    height: 600,
  }),
}))

describe('VotingTab container', () => {
  const path = buildPath(VALIDATOR_ROUTE, {
    identifier: validator.signing_key,
    tab: 'voting',
  })
  const renderVotingTab = () =>
    render(
      <NetworkContext.Provider value="main">
        <QuickHarness i18n={i18n} initialEntries={[path]}>
          <Route
            path={path}
            element={<VotingTab validatorData={validator} network="main" />}
          />
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
    renderVotingTab()
  })

  it('renders voting tab information', async () => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/amendments/vote/main`, {
      status: 200,
      response: amendments,
    })

    const { container } = renderVotingTab()

    await waitFor(() => {
      expect(container.querySelectorAll('.metrics .cell').length).toBe(3)
    })

    // Render fees voting correctly
    const cells = container.querySelectorAll('.metrics .cell')
    expect(cells[0].innerHTML).toContain('0.00001')
    expect(cells[1].innerHTML).toContain('10.00')
    expect(cells[2].innerHTML).toContain('2.00')

    // Render amendments correctly
    expect(container.querySelectorAll('.amendment-label').length).toBe(1)
    const rows = container.querySelectorAll('.voting-amendment .rows')
    expect(rows.length).toBe(2)
    expect(rows[0].innerHTML).toContain('AMM')
    expect(rows[0].innerHTML).toContain('Nay')
    expect(rows[1].innerHTML).toContain('Clawback')
    expect(rows[1].innerHTML).toContain('Yea')
  })
})
