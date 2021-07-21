import * as actionTypes from './actionTypes';

export const initialState = {
  loading: false,
  error: '',
  data: {},
};

const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_LOADING_TRANSACTION:
      return { ...state, loading: true, data: action.data };
    case actionTypes.FINISH_LOADING_TRANSACTION:
      return { ...state, loading: false };
    case actionTypes.LOADING_TRANSACTION_SUCCESS:
      return { ...state, error: '', data: action.data };
    case actionTypes.LOADING_TRANSACTION_FAIL:
      return { ...state, error: action.error, data: action.data };
    case 'persist/REHYDRATE':
      return { ...initialState };
    default:
      return state;
  }
};

export default transactionReducer;
