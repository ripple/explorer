import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { initialState } from '../../../rootReducer';
import i18n from '../../../i18nTestConfig';
import Footer from '../index';

describe('Footer component', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const createWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state });
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Footer />
        </Provider>
      </I18nextProvider>
    );
  };

  it('renders without crashing', () => {
    const wrapper = createWrapper();
    wrapper.unmount();
  });

  it('renders all parts', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.logo').length).toEqual(1);
    expect(wrapper.find('.language-container').length).toEqual(1);
    expect(wrapper.find('.copyright').length).toEqual(1);
    expect(wrapper.find('.footer-link').length).toEqual(16);
    expect(wrapper.find('.footer-section-header').length).toEqual(4);

    wrapper.unmount();
  });

  it('can change language by clicking', () => {
    const wrapper = createWrapper();
    const language = wrapper.find('.language');
    expect(language.length).toEqual(1);
    expect(i18n.language).toEqual(undefined);
    language.simulate('click');
    expect(wrapper.find('.language-item').length).toEqual(6);
    expect(wrapper.find("[data-code='en-US']").length).toEqual(1);
    expect(wrapper.find("[data-code='zh-Hans']").length).toEqual(1);
    expect(wrapper.find("[data-code='ja-JP']").length).toEqual(1);
    expect(wrapper.find("[data-code='ko-KP']").length).toEqual(1);
    expect(wrapper.find("[data-code='es-MX']").length).toEqual(1);
    expect(wrapper.find("[data-code='pt-BR']").length).toEqual(1);
    wrapper.find("[data-code='zh-Hans']").simulate('click');
    expect(i18n.language).toEqual('zh-Hans');
    wrapper.unmount();
  });

  it('can change language by keyboard', () => {
    const wrapper = createWrapper();
    const language = wrapper.find('.language');
    expect(language.length).toEqual(1);
    i18n.changeLanguage('en-US');
    expect(i18n.language).toEqual('en-US');
    // Enzyme doesn't support onKeyUp event yet
    language.simulate('click', { key: 'Tab', type: 'keyup' });
    wrapper.find("[data-code='ko-KP']").simulate('keydown', { key: 'Enter', type: 'keydown' });
    expect(i18n.language).toEqual('ko-KP');
    wrapper.unmount();
  });
});
