import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { SimpleTab } from '../SimpleTab'
import {
  expectSimpleRowLabel,
  expectSimpleRowText,
} from '../../shared/components/Transaction/test'
import i18n from '../../../i18n/testConfigEnglish'
import validator from './mock_data/validator.json'

describe('SimpleTab container', () => {
  const createWrapper = (width = 1200) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <SimpleTab data={validator} width={width} />
        </Router>
      </I18nextProvider>,
    )

  it('renders simple tab information', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.simple-body').length).toBe(1)
    expect(wrapper.find('a').length).toBe(2)
    expectSimpleRowText(wrapper, 'version', '1.9.4')
    expectSimpleRowLabel(wrapper, 'ledger-time', 'Last Ledger Date/Time (UTC)')
    expectSimpleRowText(wrapper, 'ledger-time', '5/28/2020, 9:21:19 AM')
    expectSimpleRowLabel(wrapper, 'ledger-index', 'Last Ledger Index')
    expectSimpleRowText(wrapper, 'ledger-index', '55764842')
    expectSimpleRowLabel(wrapper, '.unl', 'UNL')
    expectSimpleRowText(wrapper, '.unl', ' vl.ripple.com')
    expectSimpleRowLabel(wrapper, 'score-h1', 'Agreement (1 hour)')
    expectSimpleRowText(wrapper, 'score-h1', '1.00000')
    expectSimpleRowLabel(wrapper, 'score-h24', 'Agreement (24 hours)')
    expectSimpleRowText(wrapper, 'score-h24', '1.00000*')
    expectSimpleRowLabel(wrapper, 'score-d30', 'Agreement (30 days)')
    expectSimpleRowText(wrapper, 'score-d30', '0.99844*')
    wrapper.unmount()
  })

  it('renders index row instead of index cart in width smaller than 900', () => {
    const wrapper = createWrapper(800)
    expect(wrapper.find('.simple-body').length).toBe(1)
    const index = wrapper.find('.index')
    expect(index.length).toBe(0)
    wrapper.unmount()
  })
})
