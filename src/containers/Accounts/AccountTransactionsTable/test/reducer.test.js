import * as actionTypes from '../actionTypes';
import reducer, { initialState } from '../reducer';

describe('AccountHeader reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle START_LOADING_ACCOUNT_TRANSACTIONS', () => {
    const nextState = Object.assign({}, initialState, { loading: true });
    expect(reducer(initialState, { type: actionTypes.START_LOADING_ACCOUNT_TRANSACTIONS })).toEqual(
      nextState
    );
  });

  it('should handle FINISHED_LOADING_ACCOUNT_TRANSACTIONS', () => {
    const nextState = Object.assign({}, initialState, { loading: false });
    expect(
      reducer(initialState, { type: actionTypes.FINISHED_LOADING_ACCOUNT_TRANSACTIONS })
    ).toEqual(nextState);
  });

  it('should handle ACCOUNT_TRANSACTIONS_LOAD_SUCCESS', () => {
    const data = [
      {
        date: '2014-05-29T17:05:20+00:00',
        hash: '074415C5DC6DB0029E815EA6FC2629FBC29A2C9D479F5D040AFF94ED58ECC820',
        amount: '100000000',
        from: 'ra5nK24KXen9AHvsdFTKHSANinZseWnPcX',
        to: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'
      }
    ];
    const nextState = Object.assign({}, initialState, { data });
    expect(
      reducer(initialState, {
        data,
        type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_SUCCESS
      })
    ).toEqual(nextState);
  });

  it('should handle ACCOUNT_TRANSACTIONS_LOAD_FAIL', () => {
    const error = 'get_account_transactions_failed';
    const nextState = Object.assign({}, initialState, { error });
    expect(
      reducer(initialState, {
        error,
        type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_FAIL
      })
    ).toEqual(nextState);
  });

  it('will not clear previous data on ACCOUNT_TRANSACTIONS_LOAD_FAIL', () => {
    const data = [
      {
        date: '2014-05-29T17:05:20+00:00',
        hash: '074415C5DC6DB0029E815EA6FC2629FBC29A2C9D479F5D040AFF94ED58ECC820',
        amount: '100000000',
        from: 'ra5nK24KXen9AHvsdFTKHSANinZseWnPcX',
        to: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'
      }
    ];
    const error = 'get_account_transactions_failed';
    const stateWithData = Object.assign({}, initialState, { data });
    const nextState = Object.assign({}, stateWithData, { error });
    expect(
      reducer(stateWithData, {
        error,
        type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_FAIL
      })
    ).toEqual(nextState);
  });

  it('should clear data on rehydration', () => {
    const nextState = Object.assign({}, initialState, { error: 'error' });
    expect(
      reducer(initialState, {
        type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_FAIL,
        error: 'error'
      })
    ).toEqual(nextState);
    expect(reducer(nextState, { type: 'persist/REHYDRATE' })).toEqual(initialState);
  });
});
