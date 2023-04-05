import { combineReducers } from 'redux'
import appReducer, { initialState as appState } from './containers/App/reducer'
import accountHeaderReducer, {
  initialState as accountHeaderState,
} from './containers/Accounts/AccountHeader/reducer'
import tokenHeaderReducer, {
  initialState as tokenHeaderState,
} from './containers/Token/TokenHeader/reducer'

export const initialState = {
  app: appState,
  accountHeader: accountHeaderState,
  tokenHeader: tokenHeaderState,
}

const rootReducer = combineReducers({
  app: appReducer,
  accountHeader: accountHeaderReducer,
  tokenHeader: tokenHeaderReducer,
})

export default rootReducer
