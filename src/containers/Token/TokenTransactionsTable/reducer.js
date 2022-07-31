import * as actionTypes from './actionTypes'

export const initialState = {
  loading: false,
  data: {},
  error: '',
}

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_LOADING_ACCOUNT_TRANSACTIONS:
      return { ...state, loading: true, data: {} }
    case actionTypes.FINISHED_LOADING_ACCOUNT_TRANSACTIONS:
      return { ...state, loading: false }
    case actionTypes.ACCOUNT_TRANSACTIONS_LOAD_SUCCESS:
      return { ...state, error: '', data: action.data }
    case actionTypes.ACCOUNT_TRANSACTIONS_LOAD_FAIL:
      return {
        ...state,
        error: action.error,
        data: state.data.length ? state.data : {},
      }
    case 'persist/REHYDRATE':
      return { ...initialState }
    default:
      return state
  }
}

export default accountReducer
