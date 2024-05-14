import { combineReducers } from 'redux'
import tokenHeaderReducer, {
  initialState as tokenHeaderState,
} from './containers/Token/TokenHeader/reducer'

export const initialState = {
  tokenHeader: tokenHeaderState,
}

const rootReducer = combineReducers({
  tokenHeader: tokenHeaderReducer,
})

export default rootReducer
