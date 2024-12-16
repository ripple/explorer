import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { QueryClientProvider } from 'react-query'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18n/testConfigEnglish'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'
import { Header } from '../index'
import { queryClient } from '../../shared/QueryClient'

describe('Header component', () => {
  let client
  // Redux setup required for <Banner>
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const createWrapper = () => {
    const store = mockStore({ ...initialState })
    return mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <Provider store={store}>
            <SocketContext.Provider value={client}>
              <QueryClientProvider client={queryClient}>
                <Header />
              </QueryClientProvider>
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
    expect(wrapper.find('.search').length).toEqual(1)
    expect(wrapper.find('.navbar-brand').hostNodes().length).toEqual(1)
    expect(wrapper.find('.network').hostNodes().length).toEqual(1)
    wrapper.unmount()
  })
})
