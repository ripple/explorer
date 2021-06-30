import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { initialState } from '../../../rootReducer';
import i18n from '../../../i18nTestConfig';
import Account from '../index';
import PayStringHeader from '../PayStringHeader';
import PayStringMappingsTable from '../PayStringMappingsTable';
import mockPayStringData from './mockPayStringData.json';

describe('PayString container', () => {
  const TEST_PAY_ID = 'waterproject$paystring.tgbwidget.com';

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const creatWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state });
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Router>
            <Account match={{ params: { id: TEST_PAY_ID } }} />
          </Router>
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
        data: mockPayStringData
      }
    };

    const wrapper = creatWrapper(state);
    expect(wrapper.find(PayStringHeader).length).toBe(1);
    expect(wrapper.find(PayStringMappingsTable).length).toBe(1);
    wrapper.unmount();
  });
});
