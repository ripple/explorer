import { mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18n/testConfig'
import Token from '../index'
import TokenHeader from '../TokenHeader'
import { TokenTransactionTable } from '../TokenTransactionTable'
import mockAccountState from '../../Accounts/test/mockAccountState.json'
import { QuickHarness } from '../../test/utils'

describe('Token container', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const createWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state })
    return mount(
      <QuickHarness
        i18n={i18n}
        initialEntries={[`/token/USD.${TEST_ACCOUNT_ID}`]}
      >
        <Provider store={store}>
          <Route exact path="/token/:currency.:identifier" component={Token} />
        </Provider>
      </QuickHarness>,
    )
  }

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders static parts', () => {
    const state = {
      ...initialState,
      accountHeader: {
        loading: false,
        error: null,
        data: mockAccountState,
      },
    }

    const wrapper = createWrapper(state)
    expect(wrapper.find(TokenHeader).length).toBe(1)
    expect(wrapper.find(TokenTransactionTable).length).toBe(1)
    wrapper.unmount()
  })
})
