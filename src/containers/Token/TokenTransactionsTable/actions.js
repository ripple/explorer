import axios from 'axios';
import { analytics, ANALYTIC_TYPES } from '../../shared/utils';
import * as actionTypes from './actionTypes';

export const loadTokenTransactions = (accountId, currency, marker) => dispatch => {
  let url = `/api/v1/account_transactions/${accountId}/${currency}`;
  if (marker) {
    url += `?marker=${marker}`;
  }
  dispatch({
    type: actionTypes.START_LOADING_ACCOUNT_TRANSACTIONS
  });
  return axios
    .get(url)
    .then(response => {
      dispatch({ type: actionTypes.FINISHED_LOADING_ACCOUNT_TRANSACTIONS });
      dispatch({
        type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_SUCCESS,
        data: response.data
      });
    })
    .catch(error => {
      analytics(ANALYTIC_TYPES.exception, { exDescription: `${url} --- ${JSON.stringify(error)}` });
      dispatch({ type: actionTypes.FINISHED_LOADING_ACCOUNT_TRANSACTIONS });
      dispatch({
        type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_FAIL,
        error: 'get_account_transactions_failed'
      });
    });
};
export { loadTokenTransactions as default };
