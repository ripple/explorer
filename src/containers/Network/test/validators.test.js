import React from 'react';
import { mount } from 'enzyme';
import moxios from 'moxios';
import WS from 'jest-websocket-mock';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../../App/reducer';
import i18n from '../../../i18nTestConfig';
import Network from '../index';
import mockValidators from './mockValidators.json';
import validationMessage from './mockValidation.json';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({ app: initialState });

describe('Nodes Page container', () => {
  const createWrapper = (props = {}) =>
    mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <Network {...props} match={{ params: { tab: 'validators' }, path: '/' }} />
          </Provider>
        </I18nextProvider>
      </Router>
    );

  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('renders without crashing', () => {
    const wrapper = createWrapper();
    wrapper.unmount();
  });

  it('receives live validation', async () => {
    const server = new WS(`ws://${window.location.host}/ws`, { jsonProtocol: true });
    const wrapper = createWrapper();

    moxios.stubRequest('/api/v1/validators?verbose=true', {
      status: 200,
      response: mockValidators,
    });

    expect(wrapper.find('.validators').length).toBe(1);
    expect(wrapper.find('.stat').html()).toBe('<div class="stat"></div>');
    expect(wrapper.find('.validators-table').length).toBe(1);

    await server.connected;
    server.send(validationMessage);

    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('.stat').html()).toBe(
        '<div class="stat"><span>validators_found: </span><span>4<i> (unl: 2)</i></span></div>'
      );
      expect(wrapper.find('.validators .tooltip').length).toBe(0);

      wrapper
        .find('.validators .hexagon')
        .first()
        .simulate('mouseOver');
      wrapper.update();
      expect(wrapper.find('.validators-container .tooltip').length).toBe(1);
      expect(wrapper.find('.validators-container .tooltip .pubkey').html()).toBe(
        '<div class="pubkey">n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR</div>'
      );
      wrapper
        .find('.validators .hexagon')
        .first()
        .simulate('mouseLeave');
      wrapper.update();
      expect(wrapper.find('.validators-container .tooltip').length).toBe(0);
      expect(wrapper.find('.validators .hexagons').length).toBe(1);
      expect(wrapper.find('.validators-table table tr').length).toBe(5);
      wrapper.unmount();
    });
  });
});
