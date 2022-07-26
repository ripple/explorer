import { getNFT } from '../../../rippled';
import { analytics, ANALYTIC_TYPES, BAD_REQUEST } from '../../shared/utils';
import * as actionTypes from './actionTypes';

export const loadNFTState = (tokenId, rippledSocket) => dispatch => {
  dispatch({
    type: actionTypes.START_LOADING_NFT_STATE,
  });
  return getNFT(tokenId, rippledSocket)
    .then(data => {
      dispatch({ type: actionTypes.FINISHED_LOADING_NFT_STATE });
      dispatch({
        type: actionTypes.NFT_STATE_LOAD_SUCCESS,
        data,
      });
    })
    .catch(error => {
      const status = error.code;
      analytics(ANALYTIC_TYPES.exception, {
        exDescription: `NFT ${tokenId} --- ${JSON.stringify(error)}`,
      });
      dispatch({ type: actionTypes.FINISHED_LOADING_NFT_STATE });
      dispatch({
        type: actionTypes.NFT_STATE_LOAD_FAIL,
        error: status === 500 ? 'get_NFT_state_failed' : '',
        status,
      });
    });
};

export { loadNFTState as default };
