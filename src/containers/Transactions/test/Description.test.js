import React from 'react'
import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18nTestConfig'
import Description from '../Description'
import PaymentChannelClaim from './mock_data/PaymentChannelClaim.json'

describe('Description container', () => {
  const createWrapper = (data = {}, instructions = {}) =>
    mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <Description
            t={(s) => s}
            language="en-US"
            data={data}
            instructions={instructions}
          />
        </I18nextProvider>
      </Router>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders description for PaymentChannelClaim', () => {
    const wrapper = createWrapper(PaymentChannelClaim)
    expect(wrapper.html()).toBe(
      '<div class="detail-section"><div class="title">description</div><div>transaction_sequence<b> <span>1103</span></b></div><div>transaction_initiated_by <a class="account" title="rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN" href="/accounts/rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN">rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN</a></div><div>update_payment_channel <span class="channel">50107651E7163E294CE0EAD8A20BF7CC046304480FCC9C74A49FFAB3F46FB98E</span></div><div>the_channel_balance_is<b> \uE90049.65716<small>XRP</small></b><span> (increased_by<b> \uE9000.01<small>XRP</small></b>)</span></div></div>',
    )
    wrapper.unmount()
  })
})
