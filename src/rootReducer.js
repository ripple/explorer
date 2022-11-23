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
import payStringReducer, {
  initialState as payStringState,
} from './containers/PayStrings/PayStringMappingsTable/reducer'
import tokenHeaderReducer, {
  initialState as tokenHeaderState,
} from './containers/Token/TokenHeader/reducer'

export const initialState = {
  app: appState,
  accountHeader: accountHeaderState,
  ledger: ledgerState,
  transaction: transactionState,
  payStringData: payStringState,
  tokenHeader: tokenHeaderState,
}

const rootReducer = combineReducers({
  app: appReducer,
  accountHeader: accountHeaderReducer,
  ledger: ledgerReducer,
  transaction: transactionReducer,
  payStringData: payStringReducer,
  tokenHeader: tokenHeaderReducer,
})

export default rootReducer
