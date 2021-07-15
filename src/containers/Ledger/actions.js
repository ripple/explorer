import axios from 'axios';
import {
  analytics,
  ANALYTIC_TYPES,
  BAD_REQUEST,
  SERVER_ERROR,
  DECIMAL_REGEX,
  HASH_REGEX,
} from '../shared/utils';
import * as actionTypes from './actionTypes';

export const loadLedger = identifier => dispatch => {
  if (!DECIMAL_REGEX.test(identifier) && !HASH_REGEX.test(identifier)) {
    dispatch({
      type: actionTypes.LOADING_FULL_LEDGER_FAIL,
      data: { error: BAD_REQUEST },
    });
    return Promise.resolve();
  }

  dispatch({
    type: actionTypes.START_LOADING_FULL_LEDGER,
    data: { id: identifier },
  });

  const url = `/api/v1/ledgers/${identifier}`;

  return axios
    .get(url)
    .then(response => {
      dispatch({ type: actionTypes.FINISH_LOADING_FULL_LEDGER });
      dispatch({ type: actionTypes.LOADING_FULL_LEDGER_SUCCESS, data: response.data });
    })
    .catch(error => {
      const status = error.response && error.response.status ? error.response.status : SERVER_ERROR;
      analytics(ANALYTIC_TYPES.exception, { exDescription: `${url} --- ${JSON.stringify(error)}` });
      dispatch({ type: actionTypes.FINISH_LOADING_FULL_LEDGER });

      dispatch({
        type: actionTypes.LOADING_FULL_LEDGER_FAIL,
        data: { error: status, id: identifier },
        error: status === 500 ? 'get_ledger_failed' : '',
      });
    });
};

export { loadLedger as default };
