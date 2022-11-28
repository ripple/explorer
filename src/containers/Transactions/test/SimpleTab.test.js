import React from 'react'
import { mount, shallow } from 'enzyme'
import { I18nextProvider } from 'react-i18next'

import { BrowserRouter as Router } from 'react-router-dom'
import EnableAmendment from './mock_data/EnableAmendment.json'
import Payment from '../../shared/components/Transaction/Payment/test/mock_data/Payment.json'
import PaymentChannelClaim from './mock_data/PaymentChannelClaim.json'
import PaymentChannelCreate from './mock_data/PaymentChannelCreate.json'
import SimpleTab from '../SimpleTab'
import summarize from '../../../rippled/lib/txSummary'
import i18n from '../../../i18nTestConfig'

describe('SimpleTab container', () => {
  const createWrapper = (tx, width = 1200) =>
    mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SimpleTab
            t={(s) => s}
            language="en-US"
            data={{ raw: tx, summary: summarize(tx, true).details }}
            width={width}
          />
        </I18nextProvider>
      </Router>,
    )

  it('renders EnableAmendment without crashing', () => {
    const wrapper = createWrapper(EnableAmendment)
    wrapper.unmount()
  })

  it('renders PaymentChannelClaim without crashing', () => {
    const wrapper = createWrapper(PaymentChannelClaim)
    wrapper.unmount()
  })

  it('renders PaymentChannelCreate without crashing', () => {
    const wrapper = createWrapper(PaymentChannelCreate)
    wrapper.unmount()
  })

  it('renders simple tab information', () => {
    const wrapper = createWrapper(Payment)
    expect(wrapper.find('.simple-body').length).toBe(1)
    expect(wrapper.find('a').length).toBe(3)
    const index = wrapper.find('.index')
    expect(index.length).toBe(1)
    expect(index.contains(<div className="title">formatted_date</div>)).toBe(
      true,
    )
    expect(index.contains(<div className="title">ledger_index</div>)).toBe(true)
    expect(index.contains(<div className="title">transaction_cost</div>)).toBe(
      true,
    )
    expect(index.contains(<div className="title">sequence_number</div>)).toBe(
      true,
    )
    wrapper.unmount()
  })
})
