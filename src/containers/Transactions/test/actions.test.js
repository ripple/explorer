import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import { BAD_REQUEST } from '../../shared/utils';
import { initialState } from '../reducer';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import OfferCreateData from './mock_data/OfferCreate.json';

describe('Transaction actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store;
  beforeEach(() => {
    store = mockStore({ transaction: initialState });
    moxios.install();
  });

  afterEach(() => {
    store = null;
    moxios.uninstall();
  });

  it('should dispatch correct actions on success for loadTransaction', done => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_TRANSACTION, data: { id: OfferCreateData.hash } },
      { type: actionTypes.FINISH_LOADING_TRANSACTION },
      { type: actionTypes.LOADING_TRANSACTION_SUCCESS, data: OfferCreateData },
    ];
    store.dispatch(actions.loadTransaction(OfferCreateData.hash));
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: OfferCreateData,
        })
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
    });
  });

  it('should dispatch correct actions on fail for loadTransaction', done => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_TRANSACTION, data: { id: OfferCreateData.hash } },
      { type: actionTypes.FINISH_LOADING_TRANSACTION },
      {
        type: actionTypes.LOADING_TRANSACTION_FAIL,
        data: { error: 500, id: OfferCreateData.hash },
        error: 'get_transaction_failed',
      },
    ];
    store.dispatch(actions.loadTransaction(OfferCreateData.hash));
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 500,
          response: {},
        })
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
    });
  });

  it('should dispatch correct actions on fail for loadTransaction with invalid hash', () => {
    const expectedActions = [
      { type: actionTypes.LOADING_TRANSACTION_FAIL, data: { error: BAD_REQUEST } },
    ];
    store.dispatch(actions.loadTransaction({ identifier: 'invalid_transaction_hash' }));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
