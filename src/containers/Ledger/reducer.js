import * as actionTypes from './actionTypes';

export const initialState = {
  loading: false,
  error: '',
  data: {},
};

const rehydrate = action => {
  const payload = action.payload && action.payload.ledger ? action.payload.ledger : {};
  const ledgerData = payload.data && !payload.data.error ? payload.data : {};
  return { ...payload, loading: false, error: '', data: ledgerData };
};

const ledgerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_LOADING_FULL_LEDGER:
      return { ...state, loading: true, data: action.data };
    case actionTypes.FINISH_LOADING_FULL_LEDGER:
      return { ...state, loading: false };
    case actionTypes.LOADING_FULL_LEDGER_SUCCESS:
      return { ...state, error: '', data: action.data };
    case actionTypes.LOADING_FULL_LEDGER_FAIL:
      return { ...state, data: action.data, error: action.error };
    case 'persist/REHYDRATE':
      return { ...state, ...rehydrate(action) };
    default:
      return state;
  }
};

export default ledgerReducer;
