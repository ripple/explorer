import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import Menu from '../Menu';
import routes from './mockRoutes';

describe('Menu component', () => {
  const t = key => key;

  it('renders without crashing', () => {
    shallow(<Menu t={t} currentPath="/" />);
  });

  it('highlights current path for simple item', () => {
    const wrapper = mount(
      <Router>
        <Menu t={t} currentPath="/" routes={routes} />
      </Router>
    );
    const link = wrapper.find('.menu-item.horizontal-selected a');
    expect(link.length).toEqual(1);
    expect(link.text()).toEqual('home');
    wrapper.unmount();
  });

  it('highlights current path for nested items', () => {
    const wrapper = mount(
      <Router>
        <Menu t={t} routes={routes} currentPath="/ledgers" />
      </Router>
    );
    const link = wrapper.find('.menu-item.vertical-selected a');
    expect(link.length).toEqual(1);
    expect(link.text()).toEqual('ledgers');
    wrapper.unmount();
  });

  it('opens drop down menu reacts to events', () => {
    const wrapper = mount(
      <Router>
        <Menu t={t} routes={routes} currentPath="/" />
      </Router>
    );

    const link = wrapper.find('[data-id="explorer"]');
    expect(link.length).toEqual(1);
    expect(
      link
        .find('.nested-items')
        .first()
        .prop('style')
    ).toEqual({ display: 'none' });
    link.simulate('click');
    expect(
      wrapper
        .find('.nested-items')
        .first()
        .prop('style')
    ).toEqual({ display: 'block' });
    link.simulate('mouseleave');
    expect(
      wrapper
        .find('.nested-items')
        .first()
        .prop('style')
    ).toEqual({ display: 'none' });
    link.simulate('mouseenter');
    expect(
      wrapper
        .find('.nested-items')
        .first()
        .prop('style')
    ).toEqual({ display: 'block' });
    // Enzym doesn't support onKeyUp event yet
    link.simulate('click', { key: 'Tab', type: 'keyup' });
    expect(
      wrapper
        .find('.nested-items')
        .first()
        .prop('style')
    ).toEqual({ display: 'block' });
    wrapper.unmount();
  });
});
