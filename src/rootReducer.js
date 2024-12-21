import { combineReducers } from 'redux'
import accountHeaderReducer, {
  initialState as accountHeaderState,
} from './containers/Accounts/AccountHeader/reducer'
import tokenHeaderReducer, {
  initialState as tokenHeaderState,
} from './containers/Token/TokenHeader/reducer'

export const initialState = {
  accountHeader: accountHeaderState,
  tokenHeader: tokenHeaderState,
}

const rootReducer = combineReducers({
  accountHeader: accountHeaderReducer,
  tokenHeader: tokenHeaderReducer,
})

export default rootReducer
