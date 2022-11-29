import React from 'react'
import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18nTestConfig'
import Description from '../Description'
import PaymentChannelCreate from './mock_data/PaymentChannelCreate.json'
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

  it('renders description for PaymentChannelCreate', () => {
    const wrapper = createWrapper(PaymentChannelCreate)
    expect(wrapper.html()).toBe(
      '<div class="detail-section"><div class="title">description</div><div>transaction_sequence<b> <span>21</span></b></div><div>the_account <a class="account" title="rJnQrhRTXutuSwtrwxYiTkHn4Dtp8sF2LM" href="/accounts/rJnQrhRTXutuSwtrwxYiTkHn4Dtp8sF2LM">rJnQrhRTXutuSwtrwxYiTkHn4Dtp8sF2LM</a> create_payment_channel <a class="account" title="rUXYat4hW2M87gHoqKK7fC4cqrT9C6V7d7" href="/accounts/rUXYat4hW2M87gHoqKK7fC4cqrT9C6V7d7">rUXYat4hW2M87gHoqKK7fC4cqrT9C6V7d7</a></div><div>the_channel_id_is<span class="channel"> 15AB9EE9344C42C05164E6A1F2F08B35F35D7B9D66CCB9697452B0995C8F8242</span></div><div>the_source_tag_is<b> 2460331042</b></div><div>the_channel_amount_is<b> \uE9001.00<small>XRP</small></b></div><div>channel_settle_delay<b> 3,600 seconds</b></div><div>describe_experiation<span class="time"> null UTC</span></div><div>describe_cancel_after<span class="time"> January 1, 2000, 3:25:45 AM UTC</span></div></div>',
    )
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
