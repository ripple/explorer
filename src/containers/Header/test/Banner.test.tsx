import { render, screen, cleanup } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18n/testConfig'
import { Banner } from '../Banner'

describe('Banner component', () => {
  afterEach(cleanup)
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const renderComponent = (state = initialState) => {
    const store = mockStore(state)
    return render(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Banner />
        </Provider>
      </I18nextProvider>,
    )
  }

  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders with messages', () => {
    const state = {
      ...initialState,
    }

    renderComponent(state)
    expect(screen.queryByTestId('notification')).toBeNull()
  })
})
