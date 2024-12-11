import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import { ValidatorsTable } from '../ValidatorsTable'
import validators from './mockValidators.json'
import metrics from './metrics.json'

/* eslint-disable react/jsx-props-no-spreading */
const createWrapper = (props = {}) =>
  mount(
    <Router>
      <I18nextProvider i18n={i18n}>
        <ValidatorsTable {...props} />
      </I18nextProvider>
    </Router>,
  )

describe('Validators table', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts', () => {
    const tab = 'uptime'
    const wrapper = createWrapper({ validators, metrics, tab })
    expect(wrapper.find('tr').length).toBe(validators.length + 1)
    wrapper.unmount()
  })

  it('renders uptime tab', () => {
    const tab = 'uptime'
    const wrapper = createWrapper({ validators, metrics, tab })
    expect(wrapper.find('.uptime-tab').length).toBe(1)
    expect(wrapper.find('td.h1').at(0).text().trim()).toBe('1.00000')
    expect(wrapper.find('td.h24').at(0).text().trim()).toBe('0.91729*')
    expect(wrapper.find('td.d30').at(0).text().trim()).toBe('0.98468*')
    wrapper.unmount()
  })

  it('renders voting tab', () => {
    const tab = 'voting'
    const wrapper = createWrapper({ validators, metrics, tab })
    expect(wrapper.find('.voting-tab').length).toBe(1)
    expect(wrapper.find('td.base').at(0).text().trim()).toContain('1.00')
    expect(wrapper.find('td.owner').at(0).text().trim()).toContain('0.20')
    expect(wrapper.find('td.base_fee').at(0).text().trim()).toContain('0.00001')
    wrapper.unmount()
  })
})
