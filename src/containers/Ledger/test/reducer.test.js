import * as actionTypes from '../actionTypes'
import reducer, { initialState } from '../reducer'
import mockLedger from './mockLedger.json'

describe.only('Ledger reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle START_LOADING_FULL_LEDGER', () => {
    const nextState = { ...initialState, data: { id: 1 }, loading: true }
    expect(
      reducer(initialState, {
        type: actionTypes.START_LOADING_FULL_LEDGER,
        data: { id: 1 },
      }),
    ).toEqual(nextState)
  })

  it('should handle FINISH_LOADING_FULL_LEDGER', () => {
    const nextState = { ...initialState, loading: false }
    expect(
      reducer(initialState, { type: actionTypes.FINISH_LOADING_FULL_LEDGER }),
    ).toEqual(nextState)
  })

  it('should handle LOADING_FULL_LEDGER_SUCCESS', () => {
    const nextState = { ...initialState, data: mockLedger }
    expect(
      reducer(initialState, {
        type: actionTypes.LOADING_FULL_LEDGER_SUCCESS,
        data: mockLedger,
      }),
    ).toEqual(nextState)
  })

  it('should handle LOADING_FULL_LEDGER_FAIL', () => {
    const error = 'get_ledger_failed'
    const nextState = { ...initialState, error }
    expect(
      reducer(initialState, {
        type: actionTypes.LOADING_FULL_LEDGER_FAIL,
        data: {},
        error,
      }),
    ).toEqual(nextState)
  })

  it('should clear data on rehydration (error)', () => {
    const nextState = {
      ...initialState,
      loading: false,
      error: 'get_ledger_failed',
      data: { error: 'not found' },
    }
    expect(
      reducer(initialState, {
        type: actionTypes.LOADING_FULL_LEDGER_FAIL,
        data: { error: 'not found' },
        error: 'get_ledger_failed',
      }),
    ).toEqual(nextState)
    expect(reducer(nextState, { type: 'persist/REHYDRATE' })).toEqual(
      initialState,
    )
  })

  it('should clear data on rehydration (ledger)', () => {
    const nextState = {
      ...initialState,
      loading: false,
      error: '',
      data: mockLedger,
    }
    expect(
      reducer(initialState, {
        type: actionTypes.LOADING_FULL_LEDGER_SUCCESS,
        data: mockLedger,
      }),
    ).toEqual(nextState)
    expect(reducer(nextState, { type: 'persist/REHYDRATE' })).toEqual(
      initialState,
    )
  })
})
