import { render, waitFor } from '@testing-library/react'
import moxios from 'moxios'
import { Route } from 'react-router-dom'
import { Amendment } from '..'
import i18n from '../../../i18n/testConfig'
import NetworkContext from '../../shared/NetworkContext'
import { QuickHarness } from '../../test/utils'
import { AMENDMENT_ROUTE } from '../../App/routes'
import votingAmendment from './mockVotingAmendment.json'
import validators from './mockValidatorsList.json'
import { NOT_FOUND } from '../../shared/utils'

jest.mock('usehooks-ts', () => ({
  useWindowSize: () => ({
    width: 375,
    height: 600,
  }),
}))

const MOCK_IDENTIFIER = votingAmendment.amendment.id

describe('Amendments Page container', () => {
  const renderAmendment = () =>
    render(
      <NetworkContext.Provider value="main">
        <QuickHarness
          i18n={i18n}
          initialEntries={[`/amendment/${MOCK_IDENTIFIER}`]}
        >
          <Route path={AMENDMENT_ROUTE.path} element={<Amendment />} />
        </QuickHarness>
      </NetworkContext.Provider>,
    )

  const oldEnvs = process.env

  const { ResizeObserver } = window

  beforeEach(() => {
    moxios.install()
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }))
  })

  afterEach(() => {
    moxios.uninstall()
    process.env = oldEnvs
    window.ResizeObserver = ResizeObserver
  })

  it('renders without crashing', () => {
    renderAmendment()
  })

  it('renders all parts for a voting amendment', async () => {
    moxios.stubRequest(
      `${process.env.VITE_DATA_URL}/amendment/vote/main/${MOCK_IDENTIFIER}`,
      {
        status: 200,
        response: votingAmendment,
      },
    )

    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: validators,
    })

    const { container } = renderAmendment()

    await waitFor(() => {
      expect(
        container.querySelector('.amendment-summary .summary .type'),
      ).toBeInTheDocument()
    })

    const rows = container.querySelectorAll(
      '.amendment-summary .simple-body .rows .row',
    )

    expect(rows[0].querySelector('.value').outerHTML).toBe(
      '<div class="value">mock-name</div>',
    )

    expect(rows[1].querySelector('.value').outerHTML).toBe(
      '<div class="value">mock-amendment-id</div>',
    )

    expect(rows[2].querySelector('.value').outerHTML).toBe(
      '<div class="value"><a href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" target="_blank">v1.12.0</a></div>',
    )

    expect(rows[3].querySelector('.value').outerHTML).toBe(
      '<div class="value">3/4</div>',
    )

    expect(rows[4].querySelector('.value a').outerHTML).toBe(
      '<a href="https://xrpl.org/known-amendments.html#mock-name" target="_blank">https://xrpl.org/known-amendments.html#mock-name</a>',
    )

    expect(rows[5].querySelector('.value .badge').outerHTML).toBe(
      '<div class="badge voting">not enabled</div>',
    )

    expect(rows[6].querySelector('.value').outerHTML).toBe(
      '<div class="value">2</div>',
    )

    expect(rows[7].querySelector('.value').outerHTML).toBe(
      '<div class="value">4</div>',
    )

    expect(rows[8].querySelector('.value').outerHTML).toBe(
      '<div class="value">1</div>',
    )

    expect(rows[9].querySelector('.value').outerHTML).toBe(
      '<div class="value">3</div>',
    )

    expect(rows[10].querySelector('.value').outerHTML).toBe(
      '<div class="value eta no">voting</div>',
    )

    expect(rows[11].querySelector('.value').outerHTML).toBe(
      '<div class="value badge consensus">25%</div>',
    )

    expect(
      container.querySelectorAll('.amendment-summary .barchart').length,
    ).toBe(1)

    expect(
      container.querySelectorAll(
        '.amendment-summary .votes .votes-columns .votes-column',
      ).length,
    ).toBe(2)

    const votesColumns = container.querySelectorAll(
      '.amendment-summary .votes .votes-columns .votes-column',
    )

    expect(votesColumns[0].querySelectorAll('.vals .row').length).toBe(2)
    expect(votesColumns[1].querySelectorAll('.vals .row').length).toBe(4)
  })

  it('renders 404 page on no match', async () => {
    moxios.stubRequest(
      `${process.env.VITE_DATA_URL}/amendment/vote/main/${MOCK_IDENTIFIER}`,
      {
        status: NOT_FOUND,
        response: votingAmendment,
      },
    )

    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: validators,
    })

    const { container } = renderAmendment()

    await waitFor(() => {
      expect(container.querySelector('.no-match')).toBeInTheDocument()
    })
  })
})
