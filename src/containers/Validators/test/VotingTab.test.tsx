import { mount } from 'enzyme'
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
  const createWrapper = () =>
    mount(
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
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders voting tab information', (done) => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/amendments/vote/main`, {
      status: 200,
      response: { amendments },
    })

    const wrapper = createWrapper()

    setTimeout(() => {
      wrapper.update()

      // Render fees voting correctly
      expect(wrapper.find('.metrics .cell').length).toBe(3)
      expect(wrapper.find('.metrics .cell').at(0).html()).toContain('0.00001')
      expect(wrapper.find('.metrics .cell').at(1).html()).toContain('10.00')
      expect(wrapper.find('.metrics .cell').at(2).html()).toContain('2.00')

      // Render amendments correctly
      expect(wrapper.find('.amendment-label').length).toBe(1)
      expect(wrapper.find('.voting-amendment .rows').length).toBe(2)
      expect(wrapper.find('.voting-amendment .rows').at(0).html()).toContain(
        'AMM',
      )
      expect(wrapper.find('.voting-amendment .rows').at(0).html()).toContain(
        'Nay',
      )
      expect(wrapper.find('.voting-amendment .rows').at(1).html()).toContain(
        'Clawback',
      )
      expect(wrapper.find('.voting-amendment .rows').at(1).html()).toContain(
        'Yea',
      )
      wrapper.unmount()
      done()
    })
  })
})
