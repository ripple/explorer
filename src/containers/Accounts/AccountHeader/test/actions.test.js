import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import { initialState } from '../reducer';
import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from '../../../shared/utils';
import rippledResponses from './rippledResponses.json';
import actNotFound from '../../../Token/TokenHeader/test/actNotFound.json';
import MockWsClient from '../../../test/mockWsClient';

const TEST_ADDRESS = 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv';
const TEST_X_ADDRESS = 'XV3oNHx95sqdCkTDCBCVsVeuBmvh2dz5fTZvfw8UCcMVsfe';

describe('AccountHeader Actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let client;
  beforeEach(() => {
    client = new MockWsClient();
  });

  afterEach(() => {
    client.close();
  });

  it('should dispatch correct actions on successful loadAccountState', () => {
    client.addResponses(rippledResponses);
    const expectedData = {
      account: 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
      ledger_index: 68990183,
      info: {
        sequence: 2148991,
        ticketCount: undefined,
        ownerCount: 0,
        reserve: 10,
        tick: undefined,
        rate: undefined,
        domain: undefined,
        emailHash: undefined,
        flags: [],
        balance: '123456000',
        gravatar: undefined,
        previousTxn: '6B6F2CA1633A22247058E988372BA9EFFFC5BF10212230B67341CA32DC9D4A82',
        previousLedger: 68990183,
      },
      balances: { XRP: 123.456 },
      signerList: undefined,
      escrows: undefined,
      paychannels: null,
      xAddress: undefined,
    };
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      { type: actionTypes.ACCOUNT_STATE_LOAD_SUCCESS, data: expectedData },
    ];
    const store = mockStore({ news: initialState });

    return store.dispatch(actions.loadAccountState(TEST_ADDRESS, client)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on successful loadAccountState for X-Address', () => {
    client.addResponses(rippledResponses);
    const expectedData = {
      account: 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
      ledger_index: 68990183,
      info: {
        sequence: 2148991,
        ticketCount: undefined,
        ownerCount: 0,
        reserve: 10,
        tick: undefined,
        rate: undefined,
        domain: undefined,
        emailHash: undefined,
        flags: [],
        balance: '123456000',
        gravatar: undefined,
        previousTxn: '6B6F2CA1633A22247058E988372BA9EFFFC5BF10212230B67341CA32DC9D4A82',
        previousLedger: 68990183,
      },
      balances: { XRP: 123.456 },
      signerList: undefined,
      escrows: undefined,
      paychannels: null,
      xAddress: {
        classicAddress: 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
        tag: 0,
        test: false,
      },
    };
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      { type: actionTypes.ACCOUNT_STATE_LOAD_SUCCESS, data: expectedData },
    ];
    const store = mockStore({ news: initialState });
    return store.dispatch(actions.loadAccountState(TEST_X_ADDRESS, client)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on server error', () => {
    client.setReturnError();
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      {
        type: actionTypes.ACCOUNT_STATE_LOAD_FAIL,
        status: SERVER_ERROR,
        error: 'get_account_state_failed',
      },
    ];
    const store = mockStore({ news: initialState });

    return store.dispatch(actions.loadAccountState(TEST_ADDRESS, client)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on ripple address not found', () => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      { type: actionTypes.ACCOUNT_STATE_LOAD_FAIL, status: NOT_FOUND, error: '' },
    ];
    client.addResponse('account_info', { result: actNotFound });
    const store = mockStore({ news: initialState });
    return store.dispatch(actions.loadAccountState(TEST_ADDRESS, client)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on invalid ripple address', () => {
    const expectedActions = [
      { type: actionTypes.ACCOUNT_STATE_LOAD_FAIL, status: BAD_REQUEST, error: '' },
    ];
    const store = mockStore({ news: initialState });
    store.dispatch(actions.loadAccountState('ZZZ', client)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
