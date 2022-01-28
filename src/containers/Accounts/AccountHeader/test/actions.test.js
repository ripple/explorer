import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import { initialState } from '../reducer';
import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from '../../../shared/utils';
import moxiosData from './rippledResponses.json';
import MockResponse from '../../../test/mockRippledResponse';

const TEST_ADDRESS = 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv';
const TEST_X_ADDRESS = 'XV3oNHx95sqdCkTDCBCVsVeuBmvh2dz5fTZvfw8UCcMVsfe';

describe('AccountHeader Actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should dispatch correct actions on successful loadAccountState', () => {
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
    moxios.stubRequest(
      `/api/v1/cors/${process.env.REACT_APP_RIPPLED_HOST}`,
      new MockResponse(moxiosData)
    );
    return store.dispatch(actions.loadAccountState(TEST_ADDRESS)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on successful loadAccountState for X-Address', () => {
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
    moxios.stubRequest(
      `/api/v1/cors/${process.env.REACT_APP_RIPPLED_HOST}`,
      new MockResponse(moxiosData)
    );
    return store.dispatch(actions.loadAccountState(TEST_X_ADDRESS)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on server error', () => {
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
    moxios.stubRequest(`/api/v1/cors/${process.env.REACT_APP_RIPPLED_HOST}`, {
      status: SERVER_ERROR,
      response: null,
    });
    return store.dispatch(actions.loadAccountState(TEST_ADDRESS)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on ripple address not found', () => {
    const response = {
      account: 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
      error: 'actNotFound',
      error_code: 19,
      error_message: 'Account not found.',
      ledger_hash: '97992DBB4ED350B572B39D0026604943ACC84A3E5967454147253CB317551891',
      ledger_index: 68989958,
      request: {
        account: 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
        command: 'account_info',
        ledger_index: 'validated',
        queue: false,
        signer_lists: false,
        strict: false,
      },
      validated: true,
    };
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      { type: actionTypes.ACCOUNT_STATE_LOAD_FAIL, status: NOT_FOUND, error: '' },
    ];
    const store = mockStore({ news: initialState });
    moxios.stubRequest(`/api/v1/cors/${process.env.REACT_APP_RIPPLED_HOST}`, {
      status: 200,
      response: { result: response },
    });
    return store.dispatch(actions.loadAccountState(TEST_ADDRESS)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on invalid ripple address', () => {
    const expectedActions = [
      { type: actionTypes.ACCOUNT_STATE_LOAD_FAIL, status: BAD_REQUEST, error: '' },
    ];
    const store = mockStore({ news: initialState });
    store.dispatch(actions.loadAccountState('ZZZ')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
