import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18nTestConfig';
import ValidatorsTable from '../ValidatorsTable';
import validators from './mockValidators.json';
import metrics from './../../Ledgers/test/mock/metric.json';

const createWrapper = (props = {}) =>
  mount(
    <Router>
      <I18nextProvider i18n={i18n}>
        <ValidatorsTable {...props} />
      </I18nextProvider>
    </Router>
  );

describe('Validators table', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper();
    wrapper.unmount();
  });

  it('renders all parts', () => {
    const wrapper = createWrapper({ validators, metrics });
    expect(wrapper.find('tr').length).toBe(validators.length + 1);
    wrapper.unmount();
  });
});
