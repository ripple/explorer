import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18n/testConfig'
import Footer from '../index'

describe('Footer component', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const createWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state })
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Footer />
        </Provider>
      </I18nextProvider>,
    )
  }

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.logo').length).toEqual(1)
    expect(wrapper.find('.copyright').length).toEqual(1)
    expect(wrapper.find('.footer-link').length).toEqual(16)
    expect(wrapper.find('.footer-section-header').length).toEqual(4)

    wrapper.unmount()
  })
})
