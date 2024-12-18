import { combineReducers } from 'redux'
import accountHeaderReducer, {
  initialState as accountHeaderState,
} from './containers/Accounts/AccountHeader/reducer'

export const initialState = {
  accountHeader: accountHeaderState,
}

const rootReducer = combineReducers({
  accountHeader: accountHeaderReducer,
})

export default rootReducer
