import * as actionTypes from './actionTypes';

export const initialState = {
  loading: false,
  error: '',
  data: {},
};

const validatorReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_LOADING_VALIDATOR:
      return { ...state, loading: true, data: action.data };
    case actionTypes.FINISH_LOADING_VALIDATOR:
      return { ...state, loading: false };
    case actionTypes.LOADING_VALIDATOR_SUCCESS:
      return { ...state, error: '', data: action.data };
    case actionTypes.LOADING_VALIDATOR_FAIL:
      return { ...state, error: action.error, data: action.data };
    case 'persist/REHYDRATE':
      return { ...initialState };
    default:
      return state;
  }
};

export default validatorReducer;
