import * as actionTypes from '../actionTypes';
import reducer, { initialState } from '../reducer';

describe('AccountHeader reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle START_LOADING_ACCOUNT_STATE', () => {
    const nextState = { ...initialState, loading: true };
    expect(reducer(initialState, { type: actionTypes.START_LOADING_ACCOUNT_STATE })).toEqual(
      nextState
    );
  });

  it('should handle FINISHED_LOADING_ACCOUNT_STATE', () => {
    const nextState = { ...initialState, loading: false };
    expect(reducer(initialState, { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE })).toEqual(
      nextState
    );
  });

  it('should handle ACCOUNT_STATE_LOAD_SUCCESS', () => {
    const data = [['XRP', 123.456]];
    const nextState = { ...initialState, data };
    expect(
      reducer(initialState, {
        data,
        type: actionTypes.ACCOUNT_STATE_LOAD_SUCCESS
      })
    ).toEqual(nextState);
  });

  it('should handle ACCOUNT_STATE_LOAD_FAIL', () => {
    const status = 500;
    const error = 'error';
    const nextState = { ...initialState, status, error };
    expect(
      reducer(initialState, {
        status,
        error,
        type: actionTypes.ACCOUNT_STATE_LOAD_FAIL
      })
    ).toEqual(nextState);
  });

  it('will not clear previous data on ACCOUNT_STATE_LOAD_FAIL', () => {
    const data = [['XRP', 123.456]];
    const error = 'error';
    const status = 500;
    const stateWithData = { ...initialState, data };
    const nextState = { ...stateWithData, error, status };
    expect(
      reducer(stateWithData, {
        status,
        error,
        type: actionTypes.ACCOUNT_STATE_LOAD_FAIL
      })
    ).toEqual(nextState);
  });

  it('should clear data on rehydration', () => {
    const error = 'error';
    const status = 500;
    const nextState = { ...initialState, error, status };
    expect(
      reducer(initialState, {
        type: actionTypes.ACCOUNT_STATE_LOAD_FAIL,
        error,
        status
      })
    ).toEqual(nextState);
    expect(reducer(nextState, { type: 'persist/REHYDRATE' })).toEqual(initialState);
  });
});
