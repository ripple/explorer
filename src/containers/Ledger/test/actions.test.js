import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import mockLedger from './mockLedger.json';
import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from '../../shared/utils';
import { initialState } from '../reducer';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import { summarizeLedger } from '../../../rippled/lib/utils';
import ledgerNotFound from './ledgerNotFound.json';

describe('Ledger actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store;
  beforeEach(() => {
    store = mockStore({ ledger: initialState });
    moxios.install();
  });

  afterEach(() => {
    store = null;
    moxios.uninstall();
  });

  it('should dispatch correct actions on success for loadLedger', done => {
    const expectedActions = [
      {
        type: actionTypes.START_LOADING_FULL_LEDGER,
        data: { id: mockLedger.result.ledger.ledger_index },
      },
      { type: actionTypes.FINISH_LOADING_FULL_LEDGER },
      {
        type: actionTypes.LOADING_FULL_LEDGER_SUCCESS,
        data: summarizeLedger(mockLedger.result.ledger, true),
      },
    ];
    store.dispatch(actions.loadLedger(mockLedger.result.ledger.ledger_index));
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: mockLedger,
        })
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
    });
  });

  it('should dispatch correct actions on success for loadLedger (ledger hash)', done => {
    const expectedActions = [
      {
        type: actionTypes.START_LOADING_FULL_LEDGER,
        data: { id: mockLedger.result.ledger.ledger_hash },
      },
      { type: actionTypes.FINISH_LOADING_FULL_LEDGER },
      {
        type: actionTypes.LOADING_FULL_LEDGER_SUCCESS,
        data: summarizeLedger(mockLedger.result.ledger, true),
      },
    ];
    store.dispatch(actions.loadLedger(mockLedger.result.ledger.ledger_hash));
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: mockLedger,
        })
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
    });
  });

  it('should dispatch correct actions on fail for loadLedger with invalid id', () => {
    const expectedActions = [
      { type: actionTypes.LOADING_FULL_LEDGER_FAIL, data: { error: BAD_REQUEST } },
    ];
    store.dispatch(actions.loadLedger('zzz'));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch correct actions on fail for loadLedger 404', done => {
    const LEDGER_INDEX = 1234;
    const expectedActions = [
      { type: actionTypes.START_LOADING_FULL_LEDGER, data: { id: LEDGER_INDEX } },
      { type: actionTypes.FINISH_LOADING_FULL_LEDGER },
      {
        type: actionTypes.LOADING_FULL_LEDGER_FAIL,
        data: {
          error: NOT_FOUND,
          id: LEDGER_INDEX,
        },
        error: '',
      },
    ];
    store.dispatch(actions.loadLedger(LEDGER_INDEX));
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: ledgerNotFound,
        })
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
    });
  });

  it('should dispatch correct actions on fail for loadLedger 500', done => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_FULL_LEDGER, data: { id: 1 } },
      { type: actionTypes.FINISH_LOADING_FULL_LEDGER },
      {
        type: actionTypes.LOADING_FULL_LEDGER_FAIL,
        error: 'get_ledger_failed',
        data: {
          error: SERVER_ERROR,
          id: 1,
        },
      },
    ];
    store.dispatch(actions.loadLedger(1));
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
});
