import * as actionTypes from '../actionTypes'
import reducer, { initialState } from '../reducer'
import mockTransaction from '../../shared/components/Transaction/OfferCreate/test/mock_data/OfferCreateWithExpirationAndCancel.json'
import { BAD_REQUEST } from '../../shared/utils'

describe.only('Transaction reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle START_LOADING_TRANSACTION', () => {
    const nextState = {
      ...initialState,
      loading: true,
      data: { id: mockTransaction.hash },
    }
    expect(
      reducer(initialState, {
        type: actionTypes.START_LOADING_TRANSACTION,
        data: { id: mockTransaction.hash },
      }),
    ).toEqual(nextState)
  })

  it('should handle FINISH_LOADING_TRANSACTION', () => {
    const nextState = { ...initialState, loading: false }
    expect(
      reducer(initialState, { type: actionTypes.FINISH_LOADING_TRANSACTION }),
    ).toEqual(nextState)
  })

  it('should handle LOADING_TRANSACTION_SUCCESS', () => {
    const nextState = { ...initialState, data: mockTransaction }
    expect(
      reducer(initialState, {
        type: actionTypes.LOADING_TRANSACTION_SUCCESS,
        data: mockTransaction,
      }),
    ).toEqual(nextState)
  })

  it('should handle LOADING_TRANSACTION_FAIL', () => {
    const nextState = {
      ...initialState,
      error: true,
      data: { error: BAD_REQUEST, id: mockTransaction.hash },
    }
    expect(
      reducer(initialState, {
        type: actionTypes.LOADING_TRANSACTION_FAIL,
        error: true,
        data: { error: BAD_REQUEST, id: mockTransaction.hash },
      }),
    ).toEqual(nextState)
  })

  it('should clear data on rehydration', () => {
    const nextState = {
      ...initialState,
      error: true,
      data: { error: BAD_REQUEST, id: mockTransaction.hash },
    }
    expect(
      reducer(initialState, {
        type: actionTypes.LOADING_TRANSACTION_FAIL,
        error: true,
        data: { error: BAD_REQUEST, id: mockTransaction.hash },
      }),
    ).toEqual(nextState)
    expect(reducer(nextState, { type: 'persist/REHYDRATE' })).toEqual(
      initialState,
    )
  })
})
