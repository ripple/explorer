import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { MemoryRouter, Route } from 'react-router';
import { initialState } from '../../../rootReducer';
import i18n from '../../../i18nTestConfig';
import Account from '../index';
import AccountHeader from '../AccountHeader';
import AccountTransactionsTable from '../AccountTransactionsTable';
import mockAccountState from './mockAccountState.json';

describe('Account container', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT';

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const creatWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state });
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[`accounts/${TEST_ACCOUNT_ID}`]}>
            <Route path="accounts/:id" component={Account} />
          </MemoryRouter>
        </Provider>
      </I18nextProvider>
    );
  };

  it('renders without crashing', () => {
    const wrapper = creatWrapper();
    wrapper.unmount();
  });

  it('renders static parts', () => {
    const state = {
      ...initialState,
      accountHeader: {
        loading: false,
        error: null,
        data: mockAccountState,
      },
    };

    const wrapper = creatWrapper(state);
    expect(wrapper.find(AccountHeader).length).toBe(1);
    expect(wrapper.find(AccountTransactionsTable).length).toBe(1);
    wrapper.find('.balance-selector-button').simulate('click');
    wrapper.unmount();
  });
});
