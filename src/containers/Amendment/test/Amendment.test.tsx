import { cleanup, render, screen, within } from '@testing-library/react'
import moxios from 'moxios'
import { Route } from 'react-router-dom'
import { Amendment } from '..'
import i18n from '../../../i18n/testConfig'
import NetworkContext from '../../shared/NetworkContext'
import { QuickHarness, flushPromises } from '../../test/utils'
import { AMENDMENT_ROUTE } from '../../App/routes'
import votingAmendment from './mockVotingAmendment.json'
import validators from './mockValidatorsList.json'
import { NOT_FOUND } from '../../shared/utils'
import { expectSimpleRowText } from '../../shared/components/Transaction/test'

jest.mock('usehooks-ts', () => ({
  useWindowSize: () => ({
    width: 375,
    height: 600,
  }),
}))

const MOCK_IDENTIFIER = votingAmendment.amendment.id

describe('Amendments Page container', () => {
  const renderComponent = () =>
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
    cleanup()
  })

  it('renders without crashing', () => {
    renderComponent()
    expect(screen.queryByTitle('amendment-summary')).toBeDefined()
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

    renderComponent()
    await flushPromises()
    expect(screen.queryByTitle('summary')).toBeDefined()

    expectSimpleRowText(screen, 'name', 'mock-name')
    expectSimpleRowText(screen, 'amendment_id', 'mock-amendment-id')
    expectSimpleRowText(screen, 'introduced_in', 'v1.12.0')
    expect(screen.getByTestId('introduced_in')).toHaveTextContent('v1.12.0')
    expect(screen.getByText('v1.12.0')).toHaveAttribute(
      'href',
      'https://github.com/XRPLF/rippled/releases/tag/1.12.0',
    )

    expectSimpleRowText(screen, 'threshold', '3/4')
    expectSimpleRowText(
      screen,
      'details',
      'https://xrpl.org/known-amendments.html#mock-name',
    )

    expect(screen.getByTestId('details')).toHaveTextContent(
      'https://xrpl.org/known-amendments.html#mock-name',
    )
    expect(
      screen.getByText('https://xrpl.org/known-amendments.html#mock-name'),
    ).toHaveAttribute(
      'href',
      'https://xrpl.org/known-amendments.html#mock-name',
    )

    expect(screen.queryByTitle('enabled')).toHaveTextContent('not enabled')
    expectSimpleRowText(screen, 'yeas (all)', '2')
    expectSimpleRowText(screen, 'nays (all)', '4')
    expectSimpleRowText(screen, 'yeas (unl)', '1')
    expectSimpleRowText(screen, 'nays (unl)', '3')
    expectSimpleRowText(screen, 'eta no', 'voting')
    expectSimpleRowText(screen, 'badge consensus', '25%')

    expect(screen.queryByTitle('barchart')).toBeDefined()

    const votesColumn = screen.getAllByTitle('votes-column')
    expect(votesColumn).toHaveLength(2)
    expect(within(votesColumn[0]).getAllByTitle('validator')).toHaveLength(2)
    expect(within(votesColumn[1]).getAllByTitle('validator')).toHaveLength(4)
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

    renderComponent()
    await flushPromises()

    expect(screen.queryByTitle('no-match')).toBeDefined()
  })
})
