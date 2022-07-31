import { Dispatch } from 'redux'

import { XrplClient } from 'xrpl-client'
import { analytics, ANALYTIC_TYPES } from '../../shared/utils'
import * as actionTypes from './actionTypes'
import { getAccountNFTs } from '../../../rippled/lib/rippled'
import { AccountNFToken } from '../../shared/transactionUtils'

export const loadAccountNFTs =
  (
    accountId: string,
    marker: string | undefined,
    rippledSocket: XrplClient | undefined,
  ) =>
  (dispatch: Dispatch<any>) => {
    dispatch({
      type: actionTypes.START_LOADING_ACCOUNT_NFTS,
    })
    return getAccountNFTs(rippledSocket, accountId, marker)
      .then(onSuccess)
      .catch((error) => {
        const errorLocation = `account NFTs ${accountId} at ${marker}`
        analytics(ANALYTIC_TYPES.exception, {
          exDescription: `${errorLocation} --- ${JSON.stringify(error)}`,
        })
        dispatch({
          type: actionTypes.ACCOUNT_NFTS_LOAD_FAIL,
          error: 'get_account_nfts_failed',
        })
      })

    function onSuccess(data: {
      // eslint-disable-next-line camelcase
      account_nfts: AccountNFToken[]
      marker: string | undefined
    }) {
      dispatch({
        type: actionTypes.ACCOUNT_NFTS_LOAD_SUCCESS,
        data: {
          nfts: data.account_nfts,
          marker: data.marker,
        },
      })
    }
  }
export { loadAccountNFTs as default }
