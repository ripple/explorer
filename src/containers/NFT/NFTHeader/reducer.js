import * as actionTypes from './actionTypes';

export const initialState = {
  loading: false,
  data: {},
  error: '',
  status: null,
};

const NFTHeaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_LOADING_NFT_STATE:
      return { ...state, loading: true };
    case actionTypes.NFT_STATE_LOAD_SUCCESS:
      return { ...state, error: '', data: action.data, loading: false };
    case actionTypes.NFT_STATE_LOAD_FAIL:
      return {
        ...state,
        error: action.error,
        status: action.status,
        data: state.data.length ? state.data : {},
        loading: false,
      };
    case 'persist/REHYDRATE':
      return { ...initialState };
    default:
      return state;
  }
};

export default NFTHeaderReducer;
