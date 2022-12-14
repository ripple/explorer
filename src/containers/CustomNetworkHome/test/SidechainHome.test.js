import React from 'react'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18nTestConfig'
import SidechainHome from '../index'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'

describe('SidechainHome page', () => {
  let client
  let wrapper

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const createWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state })
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
    wrapper = createWrapper()
  })

  afterEach(() => {
    client.close()
    wrapper.unmount()
  })

  it('renders without crashing', () => {
    const appNode = wrapper.find('.app')
    expect(appNode.length).toEqual(1)

    const pageNode = wrapper.find('.custom-network-main-page')
    expect(pageNode.length).toEqual(1)
  })

  describe('test redirects', () => {
    const { location } = window
    const mockedFunction = jest.fn()
    const oldEnvs = import.meta.env

    beforeEach(() => {
      delete window.location
      window.location = { assign: mockedFunction }
      import.meta.env = { ...oldEnvs, REACT_APP_ENVIRONMENT: 'mainnet' }

      wrapper = createWrapper()
    })

    afterEach(() => {
      window.location = location
      import.meta.env = oldEnvs
    })

    it('redirect works on `enter` in textbox', () => {
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
        `${import.meta.env.VITE_CUSTOMNETWORK_LINK}/custom_url`,
      )
    })

    it('redirect works on button click', () => {
      const customNetworkInput = wrapper.find('.custom-network-input')
      customNetworkInput.simulate('change', { target: { value: 'custom_url' } })
      wrapper.update()

      const button = wrapper.find('.custom-network-input-button')
      expect(button.length).toEqual(1)
      button.simulate('click')
      expect(mockedFunction).toBeCalledWith(
        `${import.meta.env.VITE_CUSTOMNETWORK_LINK}/custom_url`,
      )
    })
  })
})
