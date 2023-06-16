import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18n/testConfig'
import SidechainHome from '../index'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'
import { CUSTOM_NETWORKS_STORAGE_KEY } from '../../shared/hooks'

describe('SidechainHome page', () => {
  let client
  let wrapper

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const createWrapper = (localNetworks = null) => {
    localStorage.removeItem(CUSTOM_NETWORKS_STORAGE_KEY)
    if (localNetworks) {
      localStorage.setItem(
        CUSTOM_NETWORKS_STORAGE_KEY,
        JSON.stringify(localNetworks),
      )
    }

    const store = mockStore(initialState)
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Router>
            <SocketContext.Provider value={client}>
              <SidechainHome />
            </SocketContext.Provider>
          </Router>
        </Provider>
      </I18nextProvider>,
    )
  }

  beforeEach(async () => {
    client = new MockWsClient()
  })

  afterEach(() => {
    client.close()
  })

  it('renders without crashing', () => {
    wrapper = createWrapper()
    const appNode = wrapper.find('.app')
    expect(appNode.length).toEqual(1)

    const pageNode = wrapper.find('.custom-network-main-page')
    expect(pageNode.length).toEqual(1)
    wrapper.unmount()
  })

  it('renders without crashing', () => {
    wrapper = createWrapper(['custom_url', 'custom_url2'])
    const appNode = wrapper.find('.app')
    expect(appNode.length).toEqual(1)

    expect(wrapper.find('.custom-network-text').length).toEqual(2)
    expect(wrapper.find('.custom-network-text').at(0)).toHaveText('custom_url')
    expect(wrapper.find('.custom-network-text').at(1)).toHaveText('custom_url2')
    wrapper.unmount()
  })

  describe('test redirects', () => {
    const { location } = window
    const mockedFunction = jest.fn()
    const oldEnvs = process.env

    beforeEach(() => {
      delete window.location
      window.location = { assign: mockedFunction }
      process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
    })

    afterEach(() => {
      window.location = location
      process.env = oldEnvs
    })

    it('redirect works on `enter` in textbox', () => {
      wrapper = createWrapper()
      expect(wrapper.find('.custom-network-input').length).toEqual(1)
      wrapper
        .find('.custom-network-input')
        .simulate('change', { target: { value: 'custom_url' } })

      wrapper.update()
      wrapper.find('.custom-network-input').prop('onKeyDown')({
        key: 'Enter',
        currentTarget: { value: 'custom_url' },
      })
      expect(mockedFunction).toBeCalledWith(
        `${process.env.VITE_CUSTOMNETWORK_LINK}/custom_url`,
      )
      wrapper.unmount()
    })
  })
})
