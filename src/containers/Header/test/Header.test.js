import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18nTestConfig'
import Header from '../index'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'

describe('Header component', () => {
  let client
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const createWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state })
    return mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <Provider store={store}>
            <SocketContext.Provider value={client}>
              <Header />
            </SocketContext.Provider>
          </Provider>
        </Router>
      </I18nextProvider>,
    )
  }

  beforeEach(() => {
    client = new MockWsClient()
  })

  afterEach(() => {
    client.close()
  })

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.search').length).toEqual(2)
    expect(wrapper.find('.logo').length).toEqual(2)
    expect(wrapper.find('.mobile-menu').length).toEqual(1)
    expect(wrapper.find('.network').length).toEqual(1)
    wrapper.unmount()
  })

  it('dropdown expands', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.dropdown').length).toEqual(1)
    expect(wrapper.find('[className="dropdown expanded"]').length).toEqual(0)

    wrapper.find('.dropdown').simulate('click')
    expect(wrapper.find('[className="dropdown expanded"]').length).toEqual(1)
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

    it('redirect works', () => {
      const wrapper = createWrapper()

      // expand dropdown
      expect(wrapper.find('.dropdown').length).toEqual(1)
      wrapper.find('.dropdown').simulate('click')
      expect(wrapper.find('[value="mainnet"]').length).toEqual(1)

      // test clicking on mainnet
      wrapper.find('[value="mainnet"]').simulate('click')
      expect(mockedFunction).not.toHaveBeenCalled()

      // test clicking on testnet
      wrapper.find('[value="testnet"]').simulate('click')
      expect(mockedFunction).toBeCalledWith(process.env.VITE_TESTNET_LINK)

      wrapper.unmount()
    })

    it('redirect on custom network input works', () => {
      const wrapper = createWrapper()

      const customInput = wrapper.find('[className="custom_network_input"]')
      customInput.prop('onKeyDown')({
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
