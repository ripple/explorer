import { render, screen, cleanup } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18n/testConfigEnglish'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'
import { Header } from '../index'

describe('Header component', () => {
  let client
  // Redux setup required for <Banner>
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const renderComponent = () => {
    const store = mockStore({ ...initialState })
    return render(
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
    cleanup()
  })

  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders all parts', () => {
    renderComponent()
    expect(screen.queryAllByTestId('search')).toHaveLength(1)
    expect(screen.queryAllByTestId('navbar-brand')).toHaveLength(1)
    expect(screen.queryAllByTestId('dropdown')).toHaveLength(3)
  })
})
