import axios from 'axios';
import { getLedger } from '../../rippled';
import { analytics, ANALYTIC_TYPES, SERVER_ERROR } from '../shared/utils';
import * as actionTypes from './actionTypes';

export const loadValidator = (identifier, socket) => dispatch => {
  dispatch({ type: actionTypes.START_LOADING_VALIDATOR, data: { id: identifier } });
  const url = `/api/v1/validators?verbose=true&key=${identifier}`;
  return axios
    .get(url)
    .then(response => {
      if (!response.data.ledger_hash) {
        getLedger(response.data.ledger_index, socket).then(ledgerData => {
          dispatch({ type: actionTypes.FINISH_LOADING_VALIDATOR });
          dispatch({
            type: actionTypes.LOADING_VALIDATOR_SUCCESS,
            data: {
              ...response.data,
              ledger_hash: ledgerData.ledger_hash,
              last_ledger_time: ledgerData.close_time,
            },
          });
        });
      } else {
        dispatch({ type: actionTypes.FINISH_LOADING_VALIDATOR });
        dispatch({ type: actionTypes.LOADING_VALIDATOR_SUCCESS, data: response.data });
      }
    })
    .catch(error => {
      const status = error.response && error.response.status ? error.response.status : SERVER_ERROR;
      analytics(ANALYTIC_TYPES.exception, { exDescription: `${url} --- ${JSON.stringify(error)}` });
      dispatch({ type: actionTypes.FINISH_LOADING_VALIDATOR });
      dispatch({
        type: actionTypes.LOADING_VALIDATOR_FAIL,
        data: { error: status, id: identifier },
        error: status === 500 ? 'get_validator_failed' : '',
      });
    });
};

export { loadValidator as default };
