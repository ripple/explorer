import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import { initialState } from '../reducer';
import mockPayStringData from '../../test/mockPayStringData.json';

const TEST_ADDRESS = 'rTEST_ADDRESS';

describe('AccountTransactionsTable Actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should dispatch correct actions on successful loadPayStringData', () => {
    const data = mockPayStringData;
    const expectedActions = [
      { type: actionTypes.START_LOADING_PAYSTRING },
      { type: actionTypes.FINISHED_LOADING_PAYSTRING },
      { type: actionTypes.PAYSTRING_LOAD_SUCCESS, data },
    ];
    const store = mockStore({ news: initialState });
    moxios.stubRequest(`/api/v1/paystrings/${TEST_ADDRESS}`, {
      status: 200,
      response: data,
    });
    return store.dispatch(actions.loadPayStringData(TEST_ADDRESS)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on none 2xx fail loadPayStringData', () => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_PAYSTRING },
      { type: actionTypes.FINISHED_LOADING_PAYSTRING },
      { type: actionTypes.RESOLVE_PAYSTRING_LOAD_FAIL, error: 'resolve_paystring_failed' },
    ];
    const store = mockStore({ news: initialState });
    moxios.stubRequest(`/api/v1/paystrings/${TEST_ADDRESS}`, {
      status: 500,
      response: null,
    });
    return store.dispatch(actions.loadPayStringData(TEST_ADDRESS)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
