import React from 'react'
import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18nTestConfig'
import Description from '../Description'
import OfferCancel from './mock_data/OfferCancel.json'
import Payment from './mock_data/Payment.json'
import TrustSet from './mock_data/TrustSet.json'
import PaymentChannelCreate from './mock_data/PaymentChannelCreate.json'
import PaymentChannelClaim from './mock_data/PaymentChannelClaim.json'
import PaymentChannelFund from './mock_data/PaymentChannelFund.json'
import SetRegularKey from '../../shared/components/Transaction/SetRegularKey/test/mock_data/SetRegularKey.json'
import AccountSet from './mock_data/AccountSet.json'
import SignerListSet from './mock_data/SignerListSet.json'
import DepositPreauth from './mock_data/DepositPreauth.json'

const RemoveRegularKey = JSON.parse(JSON.stringify(SetRegularKey))
delete RemoveRegularKey.tx.RegularKey

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

  it('renders description for OfferCancel', () => {
    const wrapper = createWrapper(OfferCancel)
    expect(wrapper.html()).toBe(
      '<div class="detail-section"><div class="title">description</div><div>transaction_sequence<b> <span>15239390</span></b></div><div>offer_cancel_description<b> 15239384</b></div></div>',
    )
    wrapper.unmount()
  })

  it('renders description for Payment', () => {
    const wrapper = createWrapper(Payment)
    expect(wrapper.html()).toBe(
      '<div class="detail-section"><div class="title">description</div><div>transaction_sequence<b> <span>31030</span></b></div>The payment is from<a class="account" title="rNQEMJA4PsoSrZRn9J6RajAYhcDzzhf8ok" href="/accounts/rNQEMJA4PsoSrZRn9J6RajAYhcDzzhf8ok">rNQEMJA4PsoSrZRn9J6RajAYhcDzzhf8ok</a>to<a class="account" title="rHoPwMC75KVUhBMeV3uDMybKG5JND74teh" href="/accounts/rHoPwMC75KVUhBMeV3uDMybKG5JND74teh">rHoPwMC75KVUhBMeV3uDMybKG5JND74teh</a><div>the_source_tag_is<b> SourceTag</b></div><div>the_destination_tag_is<b> DestinationTag</b></div><div>payment_desc_line_4<b><span> \uE9002,421.8268</span><small>XRP</small></b></div><div>payment_desc_line_6<b><span> \uE9002,421.8268</span><small>XRP</small></b></div></div>',
    )
    wrapper.unmount()
  })

  it('renders description for TrustSet', () => {
    const wrapper = createWrapper(TrustSet)
    expect(wrapper.html()).toBe(
      '<div class="detail-section"><div class="title">description</div><div>transaction_sequence<b> <span>261</span></b></div><div>It establishes <b>CN¥1,000,000,000.00</b>as the maximum amount of <b>CNY</b>from <a class="account" title="razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA" href="/accounts/razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA">razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA</a>that <a class="account" title="rhr8s3nSVJUFwkApgLP32XyYQXZ28Xphfc" href="/accounts/rhr8s3nSVJUFwkApgLP32XyYQXZ28Xphfc">rhr8s3nSVJUFwkApgLP32XyYQXZ28Xphfc</a>is willing to hold</div></div>',
    )
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

  it('renders description for PaymentChannelClaim', () => {
    const wrapper = createWrapper(PaymentChannelFund)
    expect(wrapper.html()).toBe(
      '<div class="detail-section"><div class="title">description</div><div>transaction_sequence<b> <span>593</span></b></div><div>update_payment_channel <span class="channel">4BEAC9E4C10674AB698EAC0F2D78A4FF507428370578A59B04883E7EB8D82260</span></div><div>increase_channel_amount_by<b> \uE9001.00<small>XRP</small></b><span> from <b>\uE90074.00<small>XRP</small></b> to <b>\uE90075.00<small>XRP</small></b></span></div></div>',
    )
    wrapper.unmount()
  })

  it('renders description for SetRegularKey', () => {
    const wrapper = createWrapper(SetRegularKey)
    expect(wrapper.html()).toBe(
      '<div class="detail-section"><div class="title">description</div><div>transaction_sequence<b> <span>241</span></b></div><div>set_regular_key_description <span class="regular-key">rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp</span></div></div>',
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

  it('renders description for SignerListSet', () => {
    const wrapper = createWrapper(SignerListSet)
    expect(wrapper.html()).toBe(
      '<div class="detail-section"><div class="title">description</div><div>transaction_sequence<b> <span>251</span></b></div><div>set_signer_list_description:</div><ul class="signers"><li><a class="account" title="rK8MWkYVgHR6VmPH6WpWcvVce9evvMpKSv" href="/accounts/rK8MWkYVgHR6VmPH6WpWcvVce9evvMpKSv">rK8MWkYVgHR6VmPH6WpWcvVce9evvMpKSv</a><span class="label"> - weight: </span><span>2</span></li><li><a class="account" title="rLoRH7XuBgz2kTP1ACkoyVYk9hsLggVvbP" href="/accounts/rLoRH7XuBgz2kTP1ACkoyVYk9hsLggVvbP">rLoRH7XuBgz2kTP1ACkoyVYk9hsLggVvbP</a><span class="label"> - weight: </span><span>1</span></li><li><a class="account" title="rL6SsrxyVp1JLNEZsX1hFWHcP2iJcZJ2dy" href="/accounts/rL6SsrxyVp1JLNEZsX1hFWHcP2iJcZJ2dy">rL6SsrxyVp1JLNEZsX1hFWHcP2iJcZJ2dy</a><span class="label"> - weight: </span><span>1</span></li></ul></div>',
    )
    wrapper.unmount()
  })

  it('renders description for DepositPreauth', () => {
    const wrapper = createWrapper(DepositPreauth)
    expect(wrapper.html()).toBe(
      '<div class="detail-section"><div class="title">description</div><div>transaction_sequence<b> <span>65</span></b></div><div>It Authorizes<a class="account" title="rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM" href="/accounts/rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM">rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM</a>to send payments to the account</div></div>',
    )
    wrapper.unmount()
  })
})
