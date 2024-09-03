import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'

import EnableAmendment from './mock_data/EnableAmendment.json'
import Payment from '../../shared/components/Transaction/Payment/test/mock_data/Payment.json'
import { SimpleTab } from '../SimpleTab'
import summarize from '../../../rippled/lib/txSummary'
import i18n from '../../../i18n/testConfig'
import { expectSimpleRowText } from '../../shared/components/Transaction/test'

describe('SimpleTab container', () => {
  const createWrapper = (tx, width = 1200) =>
    mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SimpleTab
            data={{ processed: tx, summary: summarize(tx, true).details }}
            width={width}
          />
        </I18nextProvider>
      </Router>,
    )

  it('renders EnableAmendment without crashing', () => {
    const wrapper = createWrapper(EnableAmendment)
    wrapper.unmount()
  })

  it('renders simple tab information', () => {
    const wrapper = createWrapper(Payment)
    expect(wrapper.find('.simple-body').length).toBe(1)
    expect(wrapper.find('a').length).toBe(3)
    expectSimpleRowText(wrapper, 'tx-date', '3/23/2018, 1:34:51 PM')
    expectSimpleRowText(wrapper, 'ledger-index', '37432866')
    expectSimpleRowText(
      wrapper,
      'account',
      'rNQEMJA4PsoSrZRn9J6RajAYhcDzzhf8ok',
    )
    expectSimpleRowText(wrapper, 'sequence', '31030')
    expectSimpleRowText(wrapper, 'tx-cost', '\uE9000.15')
    wrapper.unmount()
  })
})
