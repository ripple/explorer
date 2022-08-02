import { getPayString } from '../../../rippled'
import { analytics, ANALYTIC_TYPES } from '../../shared/utils'
import * as actionTypes from './actionTypes'

export const loadPayStringData = (payString) => (dispatch) => {
  dispatch({
    type: actionTypes.START_LOADING_PAYSTRING,
  })

  return getPayString(payString)
    .then((data) => {
      dispatch({ type: actionTypes.FINISHED_LOADING_PAYSTRING })
      dispatch({
        type: actionTypes.PAYSTRING_LOAD_SUCCESS,
        data,
      })
    })
    .catch((error) => {
      analytics(ANALYTIC_TYPES.exception, {
        exDescription: `PayString ${payString} --- ${JSON.stringify(error)}`,
      })
      dispatch({ type: actionTypes.FINISHED_LOADING_PAYSTRING })
      dispatch({
        type: actionTypes.RESOLVE_PAYSTRING_LOAD_FAIL,
        error: 'resolve_paystring_failed',
      })
    })
}

export { loadPayStringData as default }
