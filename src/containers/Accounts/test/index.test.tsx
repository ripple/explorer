import { cleanup, render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import userEvent from '@testing-library/user-event'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18n/testConfig'
import { Accounts } from '../index'
import mockAccountState from './mockAccountState.json'
import { QuickHarness } from '../../test/utils'
import { ACCOUNT_ROUTE } from '../../App/routes'

describe('Account container', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const renderComponent = (state = {}) => {
    const store = mockStore({ ...initialState, ...state })
    return render(
      <Provider store={store}>
        <QuickHarness
          i18n={i18n}
          initialEntries={[`/accounts/${TEST_ACCOUNT_ID}`]}
        >
          <Route path={ACCOUNT_ROUTE.path} element={<Accounts />} />
        </QuickHarness>
      </Provider>,
    )
  }

  afterEach(cleanup)

  it('renders without crashing', () => {
    renderComponent()
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

    renderComponent(state)
    expect(screen.getByTitle('account-header')).toBeDefined()
    expect(screen.getByTitle('transaction-table')).toBeDefined()
    userEvent.click(screen.getByRole('button'))
  })
})
