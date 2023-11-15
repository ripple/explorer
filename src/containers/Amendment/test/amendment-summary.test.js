import { mount } from 'enzyme'
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

jest.mock('usehooks-ts', () => ({
  useWindowSize: () => ({
    width: 375,
    height: 600,
  }),
}))

const MOCK_IDENTIFIER = votingAmendment.amendment.id

describe('Amendments Page container', () => {
  const createWrapper = () =>
    mount(
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
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts for a voting amendment', async (done) => {
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

    const wrapper = createWrapper()
    await flushPromises()
    await flushPromises()
    await flushPromises()
    wrapper.update()
    expect(wrapper.find('.amendment-summary .summary .type').length).toBe(1)

    expect(
      wrapper
        .find('.amendment-summary .simple-body .rows .row')
        .at(0)
        .find('.value')
        .html(),
    ).toBe('<div class="value">mock-name</div>')

    expect(
      wrapper
        .find('.amendment-summary .simple-body .rows .row')
        .at(1)
        .find('.value')
        .html(),
    ).toBe('<div class="value">mock-amendment-id</div>')

    expect(
      wrapper
        .find('.amendment-summary .simple-body .rows .row')
        .at(2)
        .find('.value')
        .html(),
    ).toBe('<div class="value">v1.12.0</div>')

    expect(
      wrapper
        .find('.amendment-summary .simple-body .rows .row')
        .at(3)
        .find('.value')
        .html(),
    ).toBe('<div class="value">3/4</div>')

    expect(
      wrapper
        .find('.amendment-summary .simple-body .rows .row')
        .at(4)
        .find('.value a')
        .html(),
    ).toBe(
      '<a href="https://xrpl.org/known-amendments.html#mock-name">https://xrpl.org/known-amendments.html#mock-name</a>',
    )

    expect(
      wrapper
        .find('.amendment-summary .simple-body .rows .row')
        .at(5)
        .find('.value .badge')
        .html(),
    ).toBe('<div class="badge voting">not enabled</div>')

    expect(
      wrapper
        .find('.amendment-summary .simple-body .rows .row')
        .at(6)
        .find('.value')
        .html(),
    ).toBe('<div class="value">2</div>')

    expect(
      wrapper
        .find('.amendment-summary .simple-body .rows .row')
        .at(7)
        .find('.value')
        .html(),
    ).toBe('<div class="value">4</div>')

    expect(
      wrapper
        .find('.amendment-summary .simple-body .rows .row')
        .at(8)
        .find('.value')
        .html(),
    ).toBe('<div class="value">1</div>')

    expect(
      wrapper
        .find('.amendment-summary .simple-body .rows .row')
        .at(9)
        .find('.value')
        .html(),
    ).toBe('<div class="value">3</div>')

    expect(
      wrapper
        .find('.amendment-summary .simple-body .rows .row')
        .at(10)
        .find('.value')
        .html(),
    ).toBe('<div class="value eta">voting</div>')

    expect(
      wrapper
        .find('.amendment-summary .simple-body .rows .row')
        .at(11)
        .find('.value')
        .html(),
    ).toBe('<div class="value badge consensus">25%</div>')

    expect(wrapper.find('.amendment-summary .barchart').length).toBe(1)

    expect(
      wrapper.find('.amendment-summary .votes .votes-columns .votes-column')
        .length,
    ).toBe(2)

    expect(
      wrapper
        .find('.amendment-summary .votes .votes-columns .votes-column')
        .at(0)
        .find('.vals .row').length,
    ).toBe(2)

    expect(
      wrapper
        .find('.amendment-summary .votes .votes-columns .votes-column')
        .at(1)
        .find('.vals .row').length,
    ).toBe(4)

    wrapper.unmount()
    done()
  })

  it('renders 404 page on no match', async (done) => {
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

    const wrapper = createWrapper()
    await flushPromises()
    await flushPromises()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('.no-match').length).toBe(1)
    wrapper.unmount()
    done()
  })
})
