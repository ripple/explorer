import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import { initialState } from '../reducer';
import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from '../../../shared/utils';
import rippledResponses from './rippledResponses.json';
import actNotFound from './actNotFound.json';
import MockWsClient from '../../../test/mockWsClient';

const TEST_ADDRESS = 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv';
const TEST_CURRENCY = 'abc';

describe('TokenHeader Actions', () => {
  jest.setTimeout(10000);

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let client;
  beforeEach(() => {
    client = new MockWsClient();
  });

  afterEach(() => {
    client.close();
  });

  it('should dispatch correct actions on successful loadTokenState', () => {
    client.addResponses(rippledResponses);
    const expectedData = {
      name: undefined,
      obligations: '100',
      sequence: 2148991,
      reserve: 10,
      rate: undefined,
      domain: undefined,
      emailHash: undefined,
      flags: [],
      balance: '123456000',
      gravatar: undefined,
      previousTxn: '6B6F2CA1633A22247058E988372BA9EFFFC5BF10212230B67341CA32DC9D4A82',
      previousLedger: 68990183,
    };
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      { type: actionTypes.ACCOUNT_STATE_LOAD_SUCCESS, data: expectedData },
    ];
    const store = mockStore({ news: initialState });
    return store.dispatch(actions.loadTokenState(TEST_CURRENCY, TEST_ADDRESS, client)).then(() => {
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
    return store.dispatch(actions.loadTokenState(TEST_CURRENCY, TEST_ADDRESS, client)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on ripple address not found', () => {
    client.addResponse('account_info', { result: actNotFound });
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      { type: actionTypes.ACCOUNT_STATE_LOAD_FAIL, status: NOT_FOUND, error: '' },
    ];
    const store = mockStore({ news: initialState });
    return store.dispatch(actions.loadTokenState(TEST_CURRENCY, TEST_ADDRESS, client)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on invalid ripple address', () => {
    const expectedActions = [
      { type: actionTypes.ACCOUNT_STATE_LOAD_FAIL, status: BAD_REQUEST, error: '' },
    ];
    const store = mockStore({ news: initialState });
    store.dispatch(actions.loadTokenState('ZZZ', null, client)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
