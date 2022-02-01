import { getTransaction } from '../../rippled';
import { analytics, ANALYTIC_TYPES, BAD_REQUEST, HASH_REGEX } from '../shared/utils';
import * as actionTypes from './actionTypes';

export const loadTransaction = (identifier, url) => dispatch => {
  if (!HASH_REGEX.test(identifier)) {
    dispatch({
      type: actionTypes.LOADING_TRANSACTION_FAIL,
      data: { error: BAD_REQUEST },
    });
    return Promise.resolve();
  }

  dispatch({ type: actionTypes.START_LOADING_TRANSACTION, data: { id: identifier } });
  return getTransaction(identifier, url)
    .then(data => {
      dispatch({ type: actionTypes.FINISH_LOADING_TRANSACTION });
      dispatch({ type: actionTypes.LOADING_TRANSACTION_SUCCESS, data });
    })
    .catch(error => {
      const status = error.code;
      analytics(ANALYTIC_TYPES.exception, {
        exDescription: `transaction ${identifier} --- ${JSON.stringify(error.message)}`,
      });
      dispatch({ type: actionTypes.FINISH_LOADING_TRANSACTION });
      dispatch({
        type: actionTypes.LOADING_TRANSACTION_FAIL,
        data: { error: status, id: identifier },
        error: status === 500 ? 'get_transaction_failed' : '',
      });
    });
};

export { loadTransaction as default };
