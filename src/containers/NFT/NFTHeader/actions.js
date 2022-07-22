import { isValidClassicAddress, isValidXAddress } from 'ripple-address-codec';
import { getToken } from '../../../rippled';
import { analytics, ANALYTIC_TYPES, BAD_REQUEST } from '../../shared/utils';
import * as actionTypes from './actionTypes';

export const loadTokenState = (tokenId, rippledSocket) => dispatch => {
  dispatch({
    type: actionTypes.START_LOADING_NFT_STATE,
  });
  return new Promise((resolve, reject) => {
    const mockData = {
      nft_id: '0000000025CC40A6A240DB42512BA22826B903A785EE2FA512C5D5A70000000C',
      ledger_index: 2436210,
      owner: 'rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W',
      is_burned: false,
      flags: 0,
      transfer_fee: 0,
      issuer: 'rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W',
      nft_taxon: 0,
      nft_sequence: 12,
      uri: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
      validated: true,
      status: 'success',
    };
    dispatch({ type: actionTypes.FINISHED_LOADING_NFT_STATE });
    dispatch({
      type: actionTypes.NFT_STATE_LOAD_SUCCESS,
      data: mockData,
    });
    resolve(mockData);
  }).then(res => console.log(res));

  // return getToken(currency, accountId, rippledSocket)
  //   .then(data => {
  //     dispatch({ type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE });
  //     dispatch({
  //       type: actionTypes.ACCOUNT_STATE_LOAD_SUCCESS,
  //       data,
  //     });
  //   })
  //   .catch(error => {
  //     const status = error.code;
  //     analytics(ANALYTIC_TYPES.exception, {
  //       exDescription: `token ${currency}.${accountId} --- ${JSON.stringify(error)}`,
  //     });
  //     dispatch({ type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE });
  //     dispatch({
  //       type: actionTypes.ACCOUNT_STATE_LOAD_FAIL,
  //       error: status === 500 ? 'get_account_state_failed' : '',
  //       status,
  //     });
  //   });
};

export { loadTokenState as default };
