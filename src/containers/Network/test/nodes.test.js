import React from 'react'
import { mount } from 'enzyme'
import moxios from 'moxios'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { initialState } from '../../App/reducer'
import i18n from '../../../i18nTestConfig'
import Network from '../index'
import mockNodes from './mockNodes.json'
import { testQueryClient } from '../../test/QueryClient'

/* eslint-disable react/jsx-props-no-spreading */
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore({ app: initialState })

describe('Nodes Page container', () => {
  const createWrapper = (props = {}) =>
    mount(
      <QueryClientProvider client={testQueryClient}>
        <Router>
          <I18nextProvider i18n={i18n}>
            <Provider store={store}>
              <Network
                {...props}
                match={{ params: { tab: 'nodes' }, path: '/' }}
              />
            </Provider>
          </I18nextProvider>
        </Router>
      </QueryClientProvider>,
    )

  const oldEnvs = process.env

  beforeEach(() => {
    moxios.install()
    process.env = { ...oldEnvs, REACT_APP_ENVIRONMENT: 'mainnet' }
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
    const wrapper = createWrapper()

    moxios.stubRequest(
      `${process.env.REACT_APP_DATA_URL}/topology/nodes/main`,
      {
        status: 200,
        response: mockNodes,
      },
    )

    expect(wrapper.find('.nodes-map').length).toBe(1)
    expect(wrapper.find('.stat').html()).toBe('<div class="stat"></div>')
    expect(wrapper.find('.nodes-table').length).toBe(1)
    setTimeout(() => {
      wrapper.update()
      expect(wrapper.find('.stat').html()).toBe(
        '<div class="stat"><span>nodes_found: </span><span>3<i> (1 unmapped)</i></span></div>',
      )
      expect(wrapper.find('.nodes-map .tooltip').length).toBe(0)
      wrapper.find('.nodes-map path.node').first().simulate('mouseOver')
      wrapper.update()
      expect(wrapper.find('.nodes-map .tooltip').length).toBe(1)
      expect(wrapper.find('.nodes-map .tooltip').html()).toBe(
        '<g class="tooltip"><rect rx="2" ry="2" x="102.80776503073434" y="44.52072594490305" width="60" height="15"></rect><text x="104.80776503073434" y="56.52072594490305">1 nodes</text></g>',
      )
      wrapper.find('.nodes-map path.node').first().simulate('mouseLeave')
      wrapper.update()
      expect(wrapper.find('.nodes-map .tooltip').length).toBe(0)
      expect(wrapper.find('.nodes-map path.node').length).toBe(2)
      expect(wrapper.find('.nodes-table table tr').length).toBe(4)
      wrapper.unmount()
      done()
    })
  })
})
