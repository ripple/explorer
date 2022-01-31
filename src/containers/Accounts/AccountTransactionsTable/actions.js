import { getAccountTransactions } from '../../../rippled';
import { analytics, ANALYTIC_TYPES } from '../../shared/utils';
import * as actionTypes from './actionTypes';

export const loadAccountTransactions = (accountId, marker, url = null) => dispatch => {
  dispatch({
    type: actionTypes.START_LOADING_ACCOUNT_TRANSACTIONS,
  });
  return getAccountTransactions(accountId, undefined, marker, undefined, url)
    .then(data => {
      dispatch({ type: actionTypes.FINISHED_LOADING_ACCOUNT_TRANSACTIONS });
      dispatch({
        type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_SUCCESS,
        data,
      });
    })
    .catch(error => {
      const errorLocation = `account transactions ${accountId} at ${marker}`;
      analytics(ANALYTIC_TYPES.exception, {
        exDescription: `${errorLocation} --- ${JSON.stringify(error)}`,
      });
      dispatch({ type: actionTypes.FINISHED_LOADING_ACCOUNT_TRANSACTIONS });
      dispatch({
        type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_FAIL,
        error: 'get_account_transactions_failed',
      });
    });
};
export { loadAccountTransactions as default };
