import * as actionTypes from '../actionTypes';
import reducer, { initialState } from '../reducer';

describe('NFTHeaders reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle START_LOADING_NFT_STATE', () => {
    const nextState = { ...initialState, loading: true };
    expect(reducer(initialState, { type: actionTypes.START_LOADING_NFT_STATE })).toEqual(nextState);
  });

  it('should handle FINISHED_LOADING_NFT_STATE', () => {
    const nextState = { ...initialState, loading: false };
    expect(reducer(initialState, { type: actionTypes.FINISHED_LOADING_NFT_STATE })).toEqual(
      nextState
    );
  });

  it('should handle NFT_STATE_LOAD_SUCCESS', () => {
    const data = [['XRP', 123.456]];
    const nextState = { ...initialState, data };
    expect(
      reducer(initialState, {
        data,
        type: actionTypes.NFT_STATE_LOAD_SUCCESS,
      })
    ).toEqual(nextState);
  });
});
