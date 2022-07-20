import { combineReducers } from 'redux';
import appReducer, { initialState as appState } from './containers/App/reducer';
import ledgerReducer, { initialState as ledgerState } from './containers/Ledger/reducer';
import accountHeaderReducer, {
  initialState as accountHeaderState,
} from './containers/Accounts/AccountHeader/reducer';
import accountTransactionsReducer, {
  initialState as accountTransactionsState,
} from './containers/Accounts/AccountTransactionsTable/reducer';
import transactionReducer, {
  initialState as transactionState,
} from './containers/Transactions/reducer';
import validatorReducer, { initialState as validatorState } from './containers/Validators/reducer';
import payStringReducer, {
  initialState as payStringState,
} from './containers/PayStrings/PayStringMappingsTable/reducer';
import tokenHeaderReducer, {
  initialState as tokenHeaderState,
} from './containers/Token/TokenHeader/reducer';
import accountNFTReducer, {
  initialState as accountNFTsState,
} from './containers/Accounts/AccountNFTTable/reducer';

export const initialState = {
  app: appState,
  accountHeader: accountHeaderState,
  accountNFTs: accountNFTsState,
  accountTransactions: accountTransactionsState,
  ledger: ledgerState,
  transaction: transactionState,
  validator: validatorState,
  payStringData: payStringState,
  tokenHeader: tokenHeaderState,
};

const rootReducer = combineReducers({
  app: appReducer,
  accountHeader: accountHeaderReducer,
  accountNFTs: accountNFTReducer,
  accountTransactions: accountTransactionsReducer,
  ledger: ledgerReducer,
  transaction: transactionReducer,
  validator: validatorReducer,
  payStringData: payStringReducer,
  tokenHeader: tokenHeaderReducer,
});

export default rootReducer;
