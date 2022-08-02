import * as actionTypes from '../actionTypes'
import reducer, { initialState } from '../reducer'

describe('NFTHeaders reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })
  it('should handle START_LOADING_NFT_STATE', () => {
    const nextState = { ...initialState, loading: true }
    expect(
      reducer(initialState, { type: actionTypes.START_LOADING_NFT_STATE }),
    ).toEqual(nextState)
  })
  it('should handle NFT_STATE_LOAD_SUCCESS', () => {
    const loadingState = {
      loading: true,
      data: {},
      error: '',
      status: null,
    }
    const data = [['XRP', 123.456]]
    const nextState = { ...loadingState, data, loading: false }
    expect(
      reducer(loadingState, {
        data,
        type: actionTypes.NFT_STATE_LOAD_SUCCESS,
      }),
    ).toEqual(nextState)
  })
  it('should handle NFT_STATE_LOAD_FAIL', () => {
    const loadingState = {
      loading: true,
      data: {},
      error: '',
      status: null,
    }
    const status = 500
    const error = 'error'
    const nextState = { ...loadingState, status, error, loading: false }
    expect(
      reducer(loadingState, {
        status,
        error,
        type: actionTypes.NFT_STATE_LOAD_FAIL,
      }),
    ).toEqual(nextState)
  })
  it('will not clear previous data on NFT_STATE_LOAD_FAIL', () => {
    const loadingState = {
      loading: true,
      data: {},
      error: '',
      status: null,
    }
    const data = [['XRP', 123.456]]
    const error = 'error'
    const status = 500
    const stateWithData = { ...loadingState, data }
    const nextState = { ...stateWithData, error, status, loading: false }
    expect(
      reducer(stateWithData, {
        status,
        error,
        type: actionTypes.NFT_STATE_LOAD_FAIL,
      }),
    ).toEqual(nextState)
  })
  it('should clear data on rehydration', () => {
    const error = 'error'
    const status = 500
    const nextState = { ...initialState, error, status }
    expect(
      reducer(initialState, {
        type: actionTypes.NFT_STATE_LOAD_FAIL,
        error,
        status,
      }),
    ).toEqual(nextState)
    expect(reducer(nextState, { type: 'persist/REHYDRATE' })).toEqual(
      initialState,
    )
  })
})
