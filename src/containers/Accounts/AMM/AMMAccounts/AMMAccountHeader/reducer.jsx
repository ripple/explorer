import * as actionTypes from 'containers/Accounts/AccountHeader/actionTypes'

export const initialState = {
  loading: false,
  data: {},
  error: '',
  status: null,
}

const accountReducerAMM = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_LOADING_ACCOUNT_STATE:
      return { ...state, loading: true }
    case actionTypes.FINISHED_LOADING_ACCOUNT_STATE:
      return { ...state, loading: false }
    case actionTypes.ACCOUNT_STATE_LOAD_SUCCESS:
      return { ...state, error: '', data: action.data }
    case actionTypes.ACCOUNT_STATE_LOAD_FAIL:
      return {
        ...state,
        error: action.error,
        status: action.status,
        data: state.data.length ? state.data : {},
      }
    case 'persist/REHYDRATE':
      return { ...initialState }
    default:
      return state
  }
}

export default accountReducerAMM
