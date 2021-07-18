import axios from 'axios';
import { isValidClassicAddress, isValidXAddress } from 'ripple-address-codec';
import { analytics, ANALYTIC_TYPES, BAD_REQUEST } from '../../shared/utils';
import * as actionTypes from './actionTypes';

export const loadAccountState = accountId => dispatch => {
  const url = `/api/v1/account_state/${accountId}`;

  if (!isValidClassicAddress(accountId) && !isValidXAddress(accountId)) {
    dispatch({
      type: actionTypes.ACCOUNT_STATE_LOAD_FAIL,
      status: BAD_REQUEST,
      error: '',
    });
    return Promise.resolve();
  }

  dispatch({
    type: actionTypes.START_LOADING_ACCOUNT_STATE,
  });
  return axios
    .get(url)
    .then(response => {
      dispatch({ type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE });
      dispatch({
        type: actionTypes.ACCOUNT_STATE_LOAD_SUCCESS,
        data: response.data,
      });
    })
    .catch(error => {
      const status = error.response ? error.response.status : 500;
      analytics(ANALYTIC_TYPES.exception, { exDescription: `${url} --- ${JSON.stringify(error)}` });
      dispatch({ type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE });
      dispatch({
        type: actionTypes.ACCOUNT_STATE_LOAD_FAIL,
        error: status === 500 ? 'get_account_state_failed' : '',
        status,
      });
    });
};

export { loadAccountState as default };
