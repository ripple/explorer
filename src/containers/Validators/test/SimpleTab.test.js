import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import SimpleTab from '../SimpleTab'
import {
  expectSimpleRowLabel,
  expectSimpleRowText,
} from '../../shared/components/Transaction/test'
import i18n from '../../../i18nTestConfig.en-US'

describe('SimpleTab container', () => {
  const createWrapper = (width = 1200) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <SimpleTab
            t={i18n.t}
            language="en-US"
            data={{
              master_key:
                'nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C',
              signing_key:
                'n9KNmrXo9gK3ucZy8KHKFM113ENGv6uyukS6Bb7TtuvEx98SdwMS',
              ledger_hash:
                'D498209A1B1BBACB9D7C8419F9A4136E7F7748E66B7936D2F92249A2C1AFBCB9',
              current_index: 55764842,
              load_fee: null,
              partial: false,
              chain: null,
              unl: 'vl.ripple.com',
              last_ledger_time: '2020-05-28T09:21:19.000Z',
              server_version: '1.9.4',
              agreement_1h: {
                score: '1.00000',
                missed: 0,
                incomplete: false,
              },
              agreement_24h: {
                score: '1.00000',
                missed: 0,
                incomplete: true,
              },
              agreement_30day: {
                score: '0.99844',
                missed: 1046,
                total: 672351,
                incomplete: true,
              },
              domain: 'digifin.uk',
            }}
            width={width}
          />
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
