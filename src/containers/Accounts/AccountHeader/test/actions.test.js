import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import { initialState } from '../reducer';
import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from '../../../shared/utils';

const TEST_ADDRESS = 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv';

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
    const data = [['XRP', 123.456]];
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      { type: actionTypes.ACCOUNT_STATE_LOAD_SUCCESS, data }
    ];
    const store = mockStore({ news: initialState });
    moxios.stubRequest(`/api/v1/account_state/${TEST_ADDRESS}`, {
      status: 200,
      response: data
    });
    return store.dispatch(actions.loadAccountState(TEST_ADDRESS)).then(() => {
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
        error: 'get_account_state_failed'
      }
    ];
    const store = mockStore({ news: initialState });
    moxios.stubRequest(`/api/v1/account_state/${TEST_ADDRESS}`, {
      status: SERVER_ERROR,
      response: null
    });
    return store.dispatch(actions.loadAccountState(TEST_ADDRESS)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on ripple address not found', () => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_STATE },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_STATE },
      { type: actionTypes.ACCOUNT_STATE_LOAD_FAIL, status: NOT_FOUND, error: '' }
    ];
    const store = mockStore({ news: initialState });
    moxios.stubRequest(`/api/v1/account_state/${TEST_ADDRESS}`, {
      status: NOT_FOUND,
      response: null
    });
    return store.dispatch(actions.loadAccountState(TEST_ADDRESS)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on invalid ripple address', () => {
    const expectedActions = [
      { type: actionTypes.ACCOUNT_STATE_LOAD_FAIL, status: BAD_REQUEST, error: '' }
    ];
    const store = mockStore({ news: initialState });
    store.dispatch(actions.loadAccountState('ZZZ')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
