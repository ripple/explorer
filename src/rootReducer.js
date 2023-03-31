import { combineReducers } from 'redux'
import appReducer, { initialState as appState } from './containers/App/reducer'
import accountHeaderReducer, {
  initialState as accountHeaderState,
} from './containers/Accounts/AccountHeader/reducer'
import payStringReducer, {
  initialState as payStringState,
} from './containers/PayStrings/PayStringMappingsTable/reducer'
import tokenHeaderReducer, {
  initialState as tokenHeaderState,
} from './containers/Token/TokenHeader/reducer'

export const initialState = {
  app: appState,
  accountHeader: accountHeaderState,
  payStringData: payStringState,
  tokenHeader: tokenHeaderState,
}

const rootReducer = combineReducers({
  app: appReducer,
  accountHeader: accountHeaderReducer,
  payStringData: payStringReducer,
  tokenHeader: tokenHeaderReducer,
})

export default rootReducer
