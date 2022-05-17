import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import rootReducer, { initialState } from '../../../../rootReducer';
import i18n from '../../../../i18nTestConfig';
import ConnectedTable, { TokenTxTable } from '../index';
import TEST_TRANSACTIONS_DATA from '../../../Accounts/AccountTransactionsTable/test/mockTransactions.json';
import { applyMiddleware, createStore } from 'redux';
import * as actionTypes from '../../../Accounts/AccountTransactionsTable/actionTypes';
import { loadTokenTransactions } from '../actions';

jest.mock('../actions', () => {
  return {
    __esModule: true,
    loadTokenTransactions: jest.fn(),
  };
});

const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT';
const TEST_CURRENCY = 'abc';

describe('TokenTransactionsTable container', () => {
  const createWrapper = (state = {}, loadTokenTransactionsImpl = () => () => {}) => {
    loadTokenTransactions.mockImplementation(loadTokenTransactionsImpl);
    const store = createStore(rootReducer, applyMiddleware(thunk));
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Router>
            <ConnectedTable accountId={TEST_ACCOUNT_ID} currency={TEST_CURRENCY} />
          </Router>
        </Provider>
      </I18nextProvider>
    );
  };

  it('renders without crashing', () => {
    const wrapper = createWrapper();
    wrapper.unmount();
  });

  it('renders static parts', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.transactions-table').length).toBe(1);
    wrapper.unmount();
  });

  it('renders loader when fetching data', () => {
    const state = { ...initialState };
    state.accountTransactions.loading = true;
    const wrapper = createWrapper(state);
    expect(wrapper.find('.loader').length).toBe(1);
    wrapper.unmount();
  });

  it('does not render loader if we have offline data', () => {
    const state = {
      ...initialState,
      accountTransactions: {
        loading: true,
        data: TEST_TRANSACTIONS_DATA,
      },
    };
    const wrapper = createWrapper(state);
    expect(wrapper.find('.loader').length).toBe(1);
    wrapper.unmount();
  });

  it('renders dynamic content with transaction data', () => {
    const component = createWrapper({}, () => dispatch => {
      dispatch({ type: actionTypes.FINISHED_LOADING_ACCOUNT_TRANSACTIONS });
      dispatch({
        type: actionTypes.ACCOUNT_TRANSACTIONS_LOAD_SUCCESS,
        data: TEST_TRANSACTIONS_DATA,
      });
    });

    expect(component.find('.load-more-btn').length).toBe(1);
    expect(component.find('.account-transactions').length).toBe(1);
    expect(component.find('.transaction-li.transaction-li-header').length).toBe(1);
    expect(component.find(Link).length).toBe(40);
  });
});
