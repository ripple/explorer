import { combineReducers } from 'redux'
import appReducer, { initialState as appState } from './containers/App/reducer'
import ledgerReducer, {
  initialState as ledgerState,
} from './containers/Ledger/reducer'
import accountHeaderReducer, {
  initialState as accountHeaderState,
} from './containers/Accounts/AccountHeader/reducer'
import transactionReducer, {
  initialState as transactionState,
} from './containers/Transactions/reducer'
import tokenHeaderReducer, {
  initialState as tokenHeaderState,
} from './containers/Token/TokenHeader/reducer'

export const initialState = {
  app: appState,
  accountHeader: accountHeaderState,
  ledger: ledgerState,
  transaction: transactionState,
  tokenHeader: tokenHeaderState,
}

const rootReducer = combineReducers({
  app: appReducer,
  accountHeader: accountHeaderReducer,
  ledger: ledgerReducer,
  transaction: transactionReducer,
  tokenHeader: tokenHeaderReducer,
})

export default rootReducer
