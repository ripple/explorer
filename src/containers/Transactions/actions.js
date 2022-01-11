import { getTransaction } from '../../server/routes/v1';
import { analytics, ANALYTIC_TYPES, BAD_REQUEST, SERVER_ERROR, HASH_REGEX } from '../shared/utils';
import * as actionTypes from './actionTypes';

export const loadTransaction = identifier => dispatch => {
  if (!HASH_REGEX.test(identifier)) {
    dispatch({
      type: actionTypes.LOADING_TRANSACTION_FAIL,
      data: { error: BAD_REQUEST },
    });
    return Promise.resolve();
  }

  dispatch({ type: actionTypes.START_LOADING_TRANSACTION, data: { id: identifier } });
  const url = `/api/v1/transactions/${identifier}`;
  return getTransaction(identifier)
    .then(response => {
      dispatch({ type: actionTypes.FINISH_LOADING_TRANSACTION });
      dispatch({ type: actionTypes.LOADING_TRANSACTION_SUCCESS, data: response });
    })
    .catch(error => {
      const status = error.response && error.response.status ? error.response.status : SERVER_ERROR;
      analytics(ANALYTIC_TYPES.exception, { exDescription: `${url} --- ${JSON.stringify(error)}` });
      dispatch({ type: actionTypes.FINISH_LOADING_TRANSACTION });
      dispatch({
        type: actionTypes.LOADING_TRANSACTION_FAIL,
        data: { error: status, id: identifier },
        error: status === 500 ? 'get_transaction_failed' : '',
      });
    });
};

export { loadTransaction as default };
