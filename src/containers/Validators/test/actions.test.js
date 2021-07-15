import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import { initialState } from '../reducer';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';

describe('Validator actions', () => {
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

  it('should dispatch correct actions on success for loadValidator', done => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_VALIDATOR, data: { id: 'some-validator-hash' } },
      { type: actionTypes.FINISH_LOADING_VALIDATOR },
      { type: actionTypes.LOADING_VALIDATOR_SUCCESS, data: { ledger_hash: 'test' } },
    ];
    store.dispatch(actions.loadValidator('some-validator-hash'));
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: { ledger_hash: 'test' },
        })
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
    });
  });

  it('should dispatch correct actions on fail for loadValidator', done => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_VALIDATOR, data: { id: 'some-validator-hash' } },
      { type: actionTypes.FINISH_LOADING_VALIDATOR },
      {
        type: actionTypes.LOADING_VALIDATOR_FAIL,
        data: { error: 500, id: 'some-validator-hash' },
        error: 'get_validator_failed',
      },
    ];
    store.dispatch(actions.loadValidator('some-validator-hash'));
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

  it('should dispatch correct actions for loadValidator regardless of hash', () => {
    const expectedActions = [
      {
        type: actionTypes.START_LOADING_VALIDATOR,
        data: { id: { identifier: 'invalid_validator_hash' } },
      },
    ];
    store.dispatch(actions.loadValidator({ identifier: 'invalid_validator_hash' }));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
