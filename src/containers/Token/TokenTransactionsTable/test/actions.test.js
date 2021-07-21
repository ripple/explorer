import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import * as actions from '../actions';
import * as actionTypes from '../actionTypes';
import { initialState } from '../reducer';

const TEST_ADDRESS = 'rTEST_ADDRESS';
const TEST_CURRENCY = 'abc';

describe('TokenTransactionsTable Actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should dispatch correct actions on successful loadTokenTransactions', () => {
    const data = [
      {
        date: '2014-05-29T17:05:20+00:00',
        hash: '074415C5DC6DB0029E815EA6FC2629FBC29A2C9D479F5D040AFF94ED58ECC820',
        amount: '100000000',
        from: 'ra5nK24KXen9AHvsdFTKHSANinZseWnPcX',
        to: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
      },
    ];
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_TRANSACTIONS },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_TRANSACTIONS },
      { type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_SUCCESS, data },
    ];
    const store = mockStore({ news: initialState });
    moxios.stubRequest(`/api/v1/account_transactions/${TEST_ADDRESS}/${TEST_CURRENCY}`, {
      status: 200,
      response: data,
    });
    return store.dispatch(actions.loadTokenTransactions(TEST_ADDRESS, TEST_CURRENCY)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions on none 2xx fail loadTokenTransactions', () => {
    const expectedActions = [
      { type: actionTypes.START_LOADING_ACCOUNT_TRANSACTIONS },
      { type: actionTypes.FINISHED_LOADING_ACCOUNT_TRANSACTIONS },
      {
        type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_FAIL,
        error: 'get_account_transactions_failed',
      },
    ];
    const store = mockStore({ news: initialState });
    moxios.stubRequest(`/api/v1/account_transactions/${TEST_ADDRESS}/${TEST_CURRENCY}`, {
      status: 500,
      response: null,
    });
    return store.dispatch(actions.loadTokenTransactions(TEST_ADDRESS, TEST_CURRENCY)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
