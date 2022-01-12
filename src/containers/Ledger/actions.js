import {
  analytics,
  ANALYTIC_TYPES,
  BAD_REQUEST,
  SERVER_ERROR,
  DECIMAL_REGEX,
  HASH_REGEX,
} from '../shared/utils';
import * as actionTypes from './actionTypes';
import { getLedger } from '../../rippled';

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

  return getLedger(identifier)
    .then(data => {
      dispatch({ type: actionTypes.FINISH_LOADING_FULL_LEDGER });
      dispatch({ type: actionTypes.LOADING_FULL_LEDGER_SUCCESS, data });
    })
    .catch(error => {
      const status = error.response && error.response.status ? error.response.status : SERVER_ERROR;
      analytics(ANALYTIC_TYPES.exception, {
        exDescription: `ledger ${identifier} --- ${JSON.stringify(error)}`,
      });
      dispatch({ type: actionTypes.FINISH_LOADING_FULL_LEDGER });

      dispatch({
        type: actionTypes.LOADING_FULL_LEDGER_FAIL,
        data: { error: status, id: identifier },
        error: status === 500 ? 'get_ledger_failed' : '',
      });
    });
};

export { loadLedger as default };
