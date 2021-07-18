import * as actionTypes from '../actionTypes';
import reducer, { initialState } from '../reducer';
import { BAD_REQUEST } from '../../shared/utils';

describe.only('Validator reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle START_LOADING_VALIDATOR', () => {
    const nextState = { ...initialState, loading: true, data: { id: 'mock-validator-key' } };
    expect(
      reducer(initialState, {
        type: actionTypes.START_LOADING_VALIDATOR,
        data: { id: 'mock-validator-key' },
      })
    ).toEqual(nextState);
  });

  it('should handle FINISH_LOADING_VALIDATOR', () => {
    const nextState = { ...initialState, loading: false };
    expect(reducer(initialState, { type: actionTypes.FINISH_LOADING_VALIDATOR })).toEqual(
      nextState
    );
  });

  it('should handle LOADING_VALIDATOR_SUCCESS', () => {
    const nextState = { ...initialState, data: { master_key: 'foo' } };
    expect(
      reducer(initialState, {
        type: actionTypes.LOADING_VALIDATOR_SUCCESS,
        data: { master_key: 'foo' },
      })
    ).toEqual(nextState);
  });

  it('should handle LOADING_VALIDATOR_FAIL', () => {
    const nextState = {
      ...initialState,
      error: true,
      data: { error: BAD_REQUEST, id: 'mock-validator-key' },
    };
    expect(
      reducer(initialState, {
        type: actionTypes.LOADING_VALIDATOR_FAIL,
        error: true,
        data: { error: BAD_REQUEST, id: 'mock-validator-key' },
      })
    ).toEqual(nextState);
  });

  it('should clear data on rehydration', () => {
    const nextState = {
      ...initialState,
      error: true,
      data: { error: BAD_REQUEST, id: 'mock-validator-key' },
    };
    expect(
      reducer(initialState, {
        type: actionTypes.LOADING_VALIDATOR_FAIL,
        error: true,
        data: { error: BAD_REQUEST, id: 'mock-validator-key' },
      })
    ).toEqual(nextState);
    expect(reducer(nextState, { type: 'persist/REHYDRATE' })).toEqual(initialState);
  });
});
