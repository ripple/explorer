import { mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18n/testConfig'
import { Accounts } from '../index'
import AccountHeader from '../AccountHeader'
import { AccountTransactionTable } from '../AccountTransactionTable'
import mockAccountState from './mockAccountState.json'
import { QuickHarness } from '../../test/utils'

describe('Account container', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const createWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state })
    return mount(
      <QuickHarness
        i18n={i18n}
        initialEntries={[`accounts/${TEST_ACCOUNT_ID}`]}
      >
        <Provider store={store}>
          <Route path="accounts/:id?" component={Accounts} />
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
    wrapper.update()
    expect(wrapper.find(AccountHeader).length).toBe(1)
    expect(wrapper.find(AccountTransactionTable).length).toBe(1)
    wrapper.find('.balance-selector button').simulate('click')
    wrapper.unmount()
  })
})
