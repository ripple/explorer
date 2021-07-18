import axios from 'axios';
import { analytics, ANALYTIC_TYPES, SERVER_ERROR } from '../shared/utils';
import * as actionTypes from './actionTypes';

export const loadValidator = identifier => dispatch => {
  dispatch({ type: actionTypes.START_LOADING_VALIDATOR, data: { id: identifier } });
  const url = `/api/v1/validators?verbose=true&key=${identifier}`;
  return axios
    .get(url)
    .then(response => {
      if (!response.data.ledger_hash) {
        axios.get(`/api/v1/ledgers/?id=${response.data.ledger_index}`).then(ledgerResp => {
          dispatch({ type: actionTypes.FINISH_LOADING_VALIDATOR });
          dispatch({
            type: actionTypes.LOADING_VALIDATOR_SUCCESS,
            data: {
              ...response.data,
              ledger_hash: ledgerResp.data.ledger_hash,
              last_ledger_time: ledgerResp.data.close_time,
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
