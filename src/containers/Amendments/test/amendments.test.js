import { render, waitFor } from '@testing-library/react'
import moxios from 'moxios'
import { Route } from 'react-router-dom'
import i18n from '../../../i18n/testConfig'
import { Amendments } from '../index'
import NetworkContext from '../../shared/NetworkContext'
import { QuickHarness } from '../../test/utils'
import { AMENDMENTS_ROUTE } from '../../App/routes'
import amendmentsRaw from './mockAmendments.json'

jest.mock('usehooks-ts', () => ({
  useWindowSize: () => ({
    width: 375,
    height: 600,
  }),
}))

describe('Amendments Page container', () => {
  const renderAmendments = () =>
    render(
      <NetworkContext.Provider value="main">
        <QuickHarness i18n={i18n} initialEntries={['/amendments']}>
          <Route path={AMENDMENTS_ROUTE.path} element={<Amendments />} />
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
    renderAmendments()
  })

  it('renders all parts', async () => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/amendments/vote/main`, {
      status: 200,
      response: amendmentsRaw,
    })
    const { container } = renderAmendments()

    expect(container.querySelectorAll('.amendments-table').length).toBe(1)
    expect(container.querySelector('.type').outerHTML).toBe(
      '<div class="type">amendments</div>',
    )

    await waitFor(() => {
      expect(
        container.querySelectorAll('.amendments-table table tr').length,
      ).toBe(amendmentsRaw.amendments.length + 1)
    })

    const rows = container.querySelectorAll('.amendments-table table tr')

    // Test voting amendment row.
    expect(rows[2].querySelector('.version').outerHTML).toBe(
      '<td class="version"><a href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" target="_blank">1.12.0</a></td>',
    )

    expect(rows[2].querySelector('.count').outerHTML).toBe(
      '<td class="count">2</td>',
    )

    expect(rows[2].querySelector('.amendment-id').outerHTML).toBe(
      '<td class="amendment-id text-truncate">56B241D7A43D40354D02A9DC4C8DF5C7A1F930D92A9035C4E12291B3CA3E1C2B</td>',
    )

    expect(rows[2].querySelector('.name .name-text').outerHTML).toBe(
      '<span class="name-text"><a class="" href="/amendment/56B241D7A43D40354D02A9DC4C8DF5C7A1F930D92A9035C4E12291B3CA3E1C2B">Clawback</a></span>',
    )

    expect(rows[2].querySelector('.voters').outerHTML).toBe(
      '<td class="voters">4</td>',
    )

    expect(rows[2].querySelector('.enabled').outerHTML).toBe(
      '<td class="enabled"><span class="badge no">no</span></td>',
    )

    expect(rows[2].querySelector('.on_tx').outerHTML).toBe(
      '<td class="on_tx"><span class="voting">voting</span></td>',
    )

    // Test enabled amendment row.
    expect(rows[4].querySelector('.version').outerHTML).toBe(
      '<td class="version"><a href="https://github.com/XRPLF/rippled/releases/tag/1.10.0" target="_blank">1.10.0</a></td>',
    )

    expect(rows[4].querySelector('.count').outerHTML).toBe(
      '<td class="count">4</td>',
    )

    expect(rows[4].querySelector('.amendment-id').outerHTML).toBe(
      '<td class="amendment-id text-truncate">75A7E01C505DD5A179DFE3E000A9B6F1EDDEB55A12F95579A23E15B15DC8BE5A</td>',
    )

    expect(rows[4].querySelector('.name .name-text').outerHTML).toBe(
      '<span class="name-text"><a class="" href="/amendment/75A7E01C505DD5A179DFE3E000A9B6F1EDDEB55A12F95579A23E15B15DC8BE5A">ImmediateOfferKilled</a></span>',
    )

    expect(rows[4].querySelector('.enabled').outerHTML).toBe(
      '<td class="enabled"><span class="badge yes">yes</span></td>',
    )

    expect(rows[4].querySelector('.on_tx').outerHTML).toBe(
      '<td class="on_tx"><a class="" href="/transactions/65B8A4068B20696A866A07E5668B2AEB0451564E13B79421356FB962EC9A536B">8/21/2023</a></td>',
    )
  })
})
