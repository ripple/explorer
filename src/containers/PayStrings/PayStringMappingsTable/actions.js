import axios from 'axios';
import { analytics, ANALYTIC_TYPES } from '../../shared/utils';
import * as actionTypes from './actionTypes';

export const loadPayStringData = payString => dispatch => {
  const url = `/api/v1/paystrings/${payString}`;

  dispatch({
    type: actionTypes.START_LOADING_PAYSTRING
  });

  return axios
    .get(url)
    .then(response => {
      dispatch({ type: actionTypes.FINISHED_LOADING_PAYSTRING });
      dispatch({
        type: actionTypes.PAYSTRING_LOAD_SUCCESS,
        data: response.data
      });
    })
    .catch(error => {
      analytics(ANALYTIC_TYPES.exception, {
        exDescription: `${payString} --- ${JSON.stringify(error)}`
      });
      dispatch({ type: actionTypes.FINISHED_LOADING_PAYSTRING });
      dispatch({
        type: actionTypes.RESOLVE_PAYSTRING_LOAD_FAIL,
        error: 'resolve_paystring_failed'
      });
    });
};

export { loadPayStringData as default };
