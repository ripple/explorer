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
      response: amendmentsRaw,
    })
    const wrapper = createWrapper()

    expect(wrapper.find('.amendments-table').length).toBe(1)
    expect(wrapper.find('.type').html()).toBe(
      '<div class="type">amendments</div>',
    )
    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('.amendments-table table tr').length).toBe(
        amendmentsRaw.amendments.length + 1,
      )

      // Test voting amendment row.

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
      ).toBe('<td class="voters">4</td>')

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

      // Test enabled amendment row.

      expect(
        wrapper
          .find('.amendments-table table tr')
          .at(4)
          .find('.version')
          .html(),
      ).toBe('<td class="version">1.10.0</td>')

      expect(
        wrapper.find('.amendments-table table tr').at(4).find('.count').html(),
      ).toBe('<td class="count">4</td>')

      expect(
        wrapper
          .find('.amendments-table table tr')
          .at(4)
          .find('.amendment-id')
          .html(),
      ).toBe(
        '<td class="amendment-id text-truncate">75A7E01C505DD5A179DFE3E000A9B6F1EDDEB55A12F95579A23E15B15DC8BE5A</td>',
      )

      expect(
        wrapper
          .find('.amendments-table table tr')
          .at(4)
          .find('.name .name-text')
          .html(),
      ).toBe('<span class="name-text">ImmediateOfferKilled</span>')

      expect(
        wrapper
          .find('.amendments-table table tr')
          .at(4)
          .find('.enabled')
          .html(),
      ).toBe('<td class="enabled"><span class="badge yes">yes</span></td>')

      expect(
        wrapper.find('.amendments-table table tr').at(4).find('.on_tx').html(),
      ).toBe(
        '<td class="on_tx"><a class="" href="/transactions/65B8A4068B20696A866A07E5668B2AEB0451564E13B79421356FB962EC9A536B">8/21/2023</a></td>',
      )

      wrapper.unmount()
      done()
    })
  })
})
