import { AnyAction } from 'redux';
import * as actionTypes from './actionTypes';
import { AccountNFToken } from '../../shared/transactionUtils';

export interface AccountNFTState {
  loading: boolean;
  data: {
    nfts?: AccountNFToken[];
    marker?: string | undefined;
  };
  error: string;
}

export const initialState: AccountNFTState = {
  loading: false,
  data: {},
  error: '',
};

const accountNFTReducer = (state: AccountNFTState = initialState, action: AnyAction) => {
  switch (action.type) {
    case actionTypes.START_LOADING_ACCOUNT_NFTS:
      return { ...state, loading: true, data: {} };
    case actionTypes.ACCOUNT_NFTS_LOAD_SUCCESS:
      return { ...state, error: '', data: action.data, loading: false };
    case actionTypes.ACCOUNT_NFTS_LOAD_FAIL:
      return {
        ...state,
        error: action.error,
        data: state.data.nfts ? state.data : {},
        loading: false,
      };
    case 'persist/REHYDRATE':
      return { ...initialState };
    default:
      return state;
  }
};

export default accountNFTReducer;
