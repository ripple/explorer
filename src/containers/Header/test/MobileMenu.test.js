import React from 'react';
import { shallow, mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../../App/reducer';
import i18n from '../../../i18nTestConfig';
import MobileMenu from '../MobileMenu';
import { BREAKPOINTS } from '../../shared/utils';
import routes from './mockRoutes';

const t = key => key;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const createWrapper = () => {
  const store = mockStore({ app: initialState });
  return mount(
    <I18nextProvider i18n={i18n}>
      <Router>
        <MobileMenu t={t} routes={routes} currentPath="/ledgers" store={store} />
      </Router>
    </I18nextProvider>
  );
};

describe('MobileMenu component', () => {
  it('renders without crashing', () => {
    const store = mockStore({ app: initialState });
    shallow(<MobileMenu t={t} currentPath="/" store={store} />);
  });

  it('highlights current path', () => {
    const wrapper = createWrapper();
    const link = wrapper.find('.mobile-item.selected a');
    expect(link.length).toEqual(1);
    expect(link.text()).toEqual('ledgers');
    wrapper.unmount();
  });

  it('menu reacts to events', () => {
    const wrapper = createWrapper();
    const link = wrapper.find('[role="menubar"]');
    expect(link.length).toEqual(1);
    expect(wrapper.find('.mobile-menu-items').prop('style')).toEqual({ display: 'none' });
    link.simulate('click');
    expect(wrapper.find('.mobile-menu-items').prop('style')).toEqual({ display: 'block' });
    link.simulate('click');
    expect(wrapper.find('.mobile-menu-items').prop('style')).toEqual({ display: 'none' });
    // Enzyme doesn't support onKeyUp event yet
    link.simulate('click', { key: 'Tab', type: 'keyup' });
    expect(wrapper.find('.mobile-menu-items').prop('style')).toEqual({ display: 'block' });
    wrapper.unmount();
  });

  it('menu close after clicking on item', () => {
    const wrapper = createWrapper();
    const link = wrapper.find('[role="menubar"]');
    expect(link.length).toEqual(1);
    expect(wrapper.find('.mobile-menu-items').prop('style')).toEqual({ display: 'none' });
    link.simulate('click');
    expect(wrapper.find('.mobile-menu-items').prop('style')).toEqual({ display: 'block' });
    wrapper.find('.mobile-item a[href="/ledgers"]').simulate('click');
    expect(wrapper.find('.mobile-menu-items').prop('style')).toEqual({ display: 'none' });
  });

  it('menu close after clicking on item', () => {
    const wrapper = createWrapper();
    const link = wrapper.find('[role="menubar"]');
    expect(link.length).toEqual(1);
    expect(wrapper.find('.mobile-menu-items').prop('style')).toEqual({ display: 'none' });
    link.simulate('click');
    expect(wrapper.find('.mobile-menu-items').prop('style')).toEqual({ display: 'block' });
    wrapper.find('.mobile-item a[href="/ledgers"]').simulate('click');
    expect(wrapper.find('.mobile-menu-items').prop('style')).toEqual({ display: 'none' });
  });

  it('responds to changes in width', () => {
    let state = { app: initialState };
    const store = mockStore(() => state);
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <MobileMenu t={t} currentPath="/ledgers" store={store} />
        </Router>
      </I18nextProvider>
    );

    const link = wrapper.find('[role="menubar"]');
    expect(link.length).toEqual(1);
    link.simulate('click');
    expect(wrapper.find('.mobile-menu-items').prop('style')).toEqual({ display: 'block' });
    state = { app: { width: BREAKPOINTS.landscape + 1 } };
    store.dispatch({ type: 'update' });
    setTimeout(() => {
      expect(wrapper.find('.mobile-menu-items').prop('style')).toEqual({ display: 'none' });
    });
  });
});
