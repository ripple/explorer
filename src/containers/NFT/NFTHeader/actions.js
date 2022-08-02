import { getNFT } from '../../../rippled'
import {
  analytics,
  ANALYTIC_TYPES,
  BAD_REQUEST,
  HASH_REGEX,
} from '../../shared/utils'
import * as actionTypes from './actionTypes'

export const loadNFTState = (tokenId, rippledSocket) => (dispatch) => {
  if (!HASH_REGEX.test(tokenId)) {
    dispatch({
      type: actionTypes.NFT_STATE_LOAD_FAIL,
      status: BAD_REQUEST,
      error: '',
    })
    return Promise.resolve()
  }
  dispatch({
    type: actionTypes.START_LOADING_NFT_STATE,
  })
  return getNFT(tokenId, rippledSocket)
    .then((data) => {
      dispatch({
        type: actionTypes.NFT_STATE_LOAD_SUCCESS,
        data,
      })
    })
    .catch((error) => {
      const status = error.code
      analytics(ANALYTIC_TYPES.exception, {
        exDescription: `NFT ${tokenId} --- ${JSON.stringify(error)}`,
      })
      dispatch({
        type: actionTypes.NFT_STATE_LOAD_FAIL,
        error: status === 500 ? 'get_nft_state_failed' : '',
        status,
      })
    })
}

export { loadNFTState as default }
