import React from 'react'
import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18nTestConfig'
import Description from '../Description'
import PaymentChannelCreate from './mock_data/PaymentChannelCreate.json'
import PaymentChannelFund from './mock_data/PaymentChannelFund.json'
import AccountSet from './mock_data/AccountSet.json'

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
    const wrapper = createWrapper(PaymentChannelFund)
    expect(wrapper.html()).toBe(
      '<div class="detail-section"><div class="title">description</div><div>transaction_sequence<b> <span>593</span></b></div><div>update_payment_channel <span class="channel">4BEAC9E4C10674AB698EAC0F2D78A4FF507428370578A59B04883E7EB8D82260</span></div><div>increase_channel_amount_by<b> \uE9001.00<small>XRP</small></b><span> from <b>\uE90074.00<small>XRP</small></b> to <b>\uE90075.00<small>XRP</small></b></span></div></div>',
    )
    wrapper.unmount()
  })

  it('renders description for AccountSet', () => {
    const wrapper = createWrapper(AccountSet)
    expect(wrapper.html()).toBe(
      '<div class="detail-section"><div class="title">description</div><div>transaction_sequence<b> <span>274470</span></b></div><div>set_domain_description <a class="domain" rel="noopener noreferrer" target="_blank" href="https://weexchange.co">weexchange.co</a></div><div>set_email_description<span class="email"> 3A3C36EEB25EDD249CE94474035CB006</span></div><div>set_message_key_description<span class="message-key"> rQD4SqHJtDxn5DDL7xNnojNa3vxS1Jx5gv</span></div><div>set_flag_description<span class="flag"> asfDisableMaster</span></div><div>clear_flag_description<span class="flag"> asfDefaultRipple</span></div></div>',
    )
    wrapper.unmount()
  })
})
