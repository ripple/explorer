import { mount } from 'enzyme'
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
  const createWrapper = () =>
    mount(
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
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts', (done) => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/amendments/vote/main`, {
      status: 200,
      response: { amendments: amendmentsRaw },
    })
    const wrapper = createWrapper()

    expect(wrapper.find('.amendments-table').length).toBe(1)
    expect(wrapper.find('.type').html()).toBe(
      '<div class="type">amendments</div>',
    )
    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('.amendments-table table tr').length).toBe(
        amendmentsRaw.enabled.amendments.length +
          amendmentsRaw.voting.amendments.length +
          1,
      )

      expect(
        wrapper
          .find('.amendments-table table tr')
          .at(2)
          .find('.version')
          .html(),
      ).toBe('<td class="version">1.12.0</td>')

      expect(
        wrapper.find('.amendments-table table tr').at(2).find('.count').html(),
      ).toBe('<td class="count">2</td>')

      expect(
        wrapper
          .find('.amendments-table table tr')
          .at(2)
          .find('.amendment-id')
          .html(),
      ).toBe(
        '<td class="amendment-id text-truncate">56B241D7A43D40354D02A9DC4C8DF5C7A1F930D92A9035C4E12291B3CA3E1C2B</td>',
      )

      expect(
        wrapper
          .find('.amendments-table table tr')
          .at(2)
          .find('.name .name-text')
          .html(),
      ).toBe('<span class="name-text">Clawback</span>')

      expect(
        wrapper.find('.amendments-table table tr').at(2).find('.voters').html(),
      ).toBe('<td class="voters">15</td>')

      expect(
        wrapper
          .find('.amendments-table table tr')
          .at(2)
          .find('.enabled')
          .html(),
      ).toBe('<td class="enabled"><span class="badge no">no</span></td>')

      expect(
        wrapper.find('.amendments-table table tr').at(2).find('.on_tx').html(),
      ).toBe('<td class="on_tx"><span class="voting">voting</span></td>')

      wrapper.unmount()
      done()
    })
  })
})
