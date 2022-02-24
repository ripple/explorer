import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { initialState } from '../../../rootReducer';
import i18n from '../../../i18nTestConfig';
import SidechainHome from '../index';

describe('SidechainHome page', () => {
  let wrapper;

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const createWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state });
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Router>
            <SidechainHome />
          </Router>
        </Provider>
      </I18nextProvider>
    );
  };

  beforeEach(async () => {
    wrapper = createWrapper();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders without crashing', () => {
    const appNode = wrapper.find('.app');
    expect(appNode.length).toEqual(1);

    const pageNode = wrapper.find('.sidechain-main-page');
    expect(pageNode.length).toEqual(1);
  });

  describe('test redirects', () => {
    const { location } = window;
    const mockedFunction = jest.fn();
    const oldEnvs = process.env;

    beforeEach(() => {
      delete window.location;
      // mockedFunction = jest.fn();
      window.location = { assign: mockedFunction };
      process.env = { ...oldEnvs, REACT_APP_ENVIRONMENT: 'mainnet' };

      wrapper = createWrapper();
    });

    afterEach(() => {
      window.location = location;
      process.env = oldEnvs;
    });

    it('redirect works when sidechain is entered', () => {
      // expand dropdown
      expect(wrapper.find('.sidechain-input').length).toEqual(1);
      const sidechainInput = wrapper.find('.sidechain-input');
      sidechainInput.prop('onKeyDown')({ key: 'Enter', currentTarget: { value: 'sidechain_url' } });
      expect(mockedFunction).toBeCalledWith(
        `${process.env.REACT_APP_SIDECHAIN_LINK}/sidechain_url`
      );
    });

    it('redirect works on button click', () => {
      const sidechainInput = wrapper.find('.sidechain-input');
      sidechainInput.simulate('change', { target: { value: 'sidechain_url' } });

      const { ref } = sidechainInput.getElement();
      ref.current.value = 'sidechain_url';

      const button = wrapper.find('.button');
      expect(button.length).toEqual(1);
      button.simulate('click');
      expect(mockedFunction).toBeCalledWith(
        `${process.env.REACT_APP_SIDECHAIN_LINK}/sidechain_url`
      );
    });
  });
});
