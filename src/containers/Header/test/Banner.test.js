import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18n/testConfig'
import Banner from '../Banner'

describe('Banner component', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const createWrapper = (state = initialState) => {
    const store = mockStore(state)
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Banner />
        </Provider>
      </I18nextProvider>,
    )
  }

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders with messages', () => {
    const state = {
      ...initialState,
      transaction: {
        error: 'transaction_error',
      },
    }

    const wrapper = createWrapper(state)
    expect(wrapper.find('.notification').length).toEqual(1)
    wrapper.unmount()
  })
})
