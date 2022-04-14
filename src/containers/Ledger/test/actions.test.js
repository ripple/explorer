import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import mockLedger from './mockLedger.json';
import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from '../../shared/utils';
import { initialState } from '../reducer';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import { summarizeLedger } from '../../../rippled/lib/utils';
import ledgerNotFound from './ledgerNotFound.json';
import TestWsClient from '../../test/testWsClient';

describe('Ledger actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store;
  beforeEach(() => {
    store = mockStore({ ledger: initialState });
  });

  afterEach(() => {
    store = null;
  });

  it('should dispatch correct actions on success for loadLedger', async () => {
    const client = new TestWsClient();
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
    client.addResponse(mockLedger.result);

    await store.dispatch(actions.loadLedger(mockLedger.result.ledger.ledger_index, client));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch correct actions on success for loadLedger (ledger hash)', async () => {
    const client = new TestWsClient();
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
    client.addResponse(mockLedger.result);

    await store.dispatch(actions.loadLedger(mockLedger.result.ledger.ledger_hash, client));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch correct actions on fail for loadLedger with invalid id', () => {
    const expectedActions = [
      { type: actionTypes.LOADING_FULL_LEDGER_FAIL, data: { error: BAD_REQUEST } },
    ];
    store.dispatch(actions.loadLedger('zzz', null));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch correct actions on fail for loadLedger 404', async () => {
    const client = new TestWsClient();
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
    client.addResponse(ledgerNotFound.result);

    await store.dispatch(actions.loadLedger(LEDGER_INDEX, client));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch correct actions on fail for loadLedger 500', async () => {
    const client = new TestWsClient();
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
    client.addResponse({}, true);
    await store.dispatch(actions.loadLedger(1, client));

    const receivedActions = store.getActions();
    expect(receivedActions).toEqual(expectedActions);
  });
});
