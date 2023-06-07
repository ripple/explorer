import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import Transaction from './mock_data/Transaction.json'
import OfferCancel from '../../shared/components/Transaction/OfferCancel/test/mock_data/OfferCancel.json'
import OfferCreateWithMissingPreviousFields from '../../shared/components/Transaction/OfferCreate/test/mock_data/OfferCreateWithMissingPreviousFields.json'
import PaymentChannelClaim from '../../shared/components/Transaction/PaymentChannelClaim/test/mock_data/PaymentChannelClaim.json'
import { TransactionMeta } from '../Meta'

describe('TransactionMeta container', () => {
  const createWrapper = (data: any = Transaction) =>
    mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <TransactionMeta data={data} />
        </I18nextProvider>
      </Router>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders Meta', () => {
    const w = createWrapper()
    expect(w.find('.title').length).toBe(1)
    expect(w.find('.meta-section').length).toBe(1)
    expect(w.contains(<div>number_of_affected_node</div>)).toBe(true)
    expect(w.contains(<div className="meta-title">nodes_type</div>)).toBe(true)
    expect(w.find('li').length).toBe(23)

    expect(w.find('li').at(0).html()).toBe(
      '<li class="meta-line">owned_account_root <a class="account" title="rUmustd4TbkjaEuS7S1damozpBEREgRz9z" href="/accounts/rUmustd4TbkjaEuS7S1damozpBEREgRz9z">rUmustd4TbkjaEuS7S1damozpBEREgRz9z</a><ul class="meta-line"><li>Balance decreased by<b>-\uE90050.324316<small>XRP</small></b>from<b>\uE9002,910.704988<small>XRP</small></b>to<b>\uE9002,860.380672<small>XRP</small></b></li></ul></li>',
    )

    expect(w.find('li').at(1).html()).toBe(
      '<li>Balance decreased by<b>-\uE90050.324316<small>XRP</small></b>from<b>\uE9002,910.704988<small>XRP</small></b>to<b>\uE9002,860.380672<small>XRP</small></b></li>',
    )

    expect(w.find('li').at(2).html()).toBe(
      '<li class="meta-line">owned_account_root <a class="account" title="rPt8rwFrsucmjdKfjwRHGz9iZGxxN2cLYh" href="/accounts/rPt8rwFrsucmjdKfjwRHGz9iZGxxN2cLYh">rPt8rwFrsucmjdKfjwRHGz9iZGxxN2cLYh</a><ul class="meta-line"><li>Balance decreased by<b>-\uE9000.000012<small>XRP</small></b>from<b>\uE90098.595124<small>XRP</small></b>to<b>\uE90098.595112<small>XRP</small></b></li></ul></li>',
    )

    expect(w.find('li').at(3).html()).toBe(
      '<li>Balance decreased by<b>-\uE9000.000012<small>XRP</small></b>from<b>\uE90098.595124<small>XRP</small></b>to<b>\uE90098.595112<small>XRP</small></b></li>',
    )

    expect(w.find('li').at(4).html()).toBe(
      '<li class="meta-line">owned_account_root <a class="account" title="rEGoBvzusE2MkDn3yrgZc817XiwRofqoJq" href="/accounts/rEGoBvzusE2MkDn3yrgZc817XiwRofqoJq">rEGoBvzusE2MkDn3yrgZc817XiwRofqoJq</a><ul class="meta-line"><li>Balance increased by<b>\uE90050.324316<small>XRP</small></b>from<b>\uE9005,703.912258<small>XRP</small></b>to<b>\uE9005,754.236574<small>XRP</small></b></li></ul></li>',
    )

    expect(w.find('li').at(5).html()).toBe(
      '<li>Balance increased by<b>\uE90050.324316<small>XRP</small></b>from<b>\uE9005,703.912258<small>XRP</small></b>to<b>\uE9005,754.236574<small>XRP</small></b></li>',
    )

    expect(w.find('li').at(6).html()).toBe(
      '<li class="meta-line">transaction_owned_directory<span> <a class="account" title="rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe" href="/accounts/rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe">rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe</a></span></li>',
    )

    expect(w.find('li').at(7).html()).toBe(
      '<li class="meta-line">It modified a <b>XRP/CNY</b>owned by<a class="account" title="rEGoBvzusE2MkDn3yrgZc817XiwRofqoJq" href="/accounts/rEGoBvzusE2MkDn3yrgZc817XiwRofqoJq">rEGoBvzusE2MkDn3yrgZc817XiwRofqoJq</a>with sequence # <b>1181517</b><ul><li class="meta-line">offer_partially_filled</li><li class="meta-line"><span class="field">TakerPays </span><b>XRP</b> decreased by<b>\uE90050.324316</b>from<b>\uE900470.31823</b>to<b>\uE900419.993914</b></li><li class="meta-line"><span class="field">TakerGets </span><b>CNY</b>.<a class="account" title="rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y" href="/accounts/rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y">rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y</a> decreased by<b>CN¥224.7141103</b>from<b>CN¥2,100.12079671</b>to<b>CN¥1,875.40668641</b></li></ul></li>',
    )

    expect(w.find('li').at(8).html()).toBe(
      '<li class="meta-line">offer_partially_filled</li>',
    )

    expect(w.find('li').at(9).html()).toBe(
      '<li class="meta-line"><span class="field">TakerPays </span><b>XRP</b> decreased by<b>\uE90050.324316</b>from<b>\uE900470.31823</b>to<b>\uE900419.993914</b></li>',
    )

    expect(w.find('li').at(10).html()).toBe(
      '<li class="meta-line"><span class="field">TakerGets </span><b>CNY</b>.<a class="account" title="rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y" href="/accounts/rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y">rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y</a> decreased by<b>CN¥224.7141103</b>from<b>CN¥2,100.12079671</b>to<b>CN¥1,875.40668641</b></li>',
    )

    expect(w.find('li').at(11).html()).toBe(
      '<li class="meta-line">It modified a <b>XRP/CNY</b>owned by<a class="account" title="rUmustd4TbkjaEuS7S1damozpBEREgRz9z" href="/accounts/rUmustd4TbkjaEuS7S1damozpBEREgRz9z">rUmustd4TbkjaEuS7S1damozpBEREgRz9z</a>with sequence # <b>5804</b><ul><li class="meta-line">offer_partially_filled</li><li class="meta-line"><span class="field">TakerPays </span><b>CNY</b>.<a class="account" title="razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA" href="/accounts/razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA">razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA</a> decreased by<b>CN¥225.45293634</b>from<b>CN¥12,589.58241408</b>to<b>CN¥12,364.12947774</b></li><li class="meta-line"><span class="field">TakerGets </span><b>XRP</b> decreased by<b>\uE90050.324316</b>from<b>\uE9002,810.174646</b>to<b>\uE9002,759.85033</b></li></ul></li>',
    )

    expect(w.find('li').at(12).html()).toBe(
      '<li class="meta-line">offer_partially_filled</li>',
    )

    expect(w.find('li').at(13).html()).toBe(
      '<li class="meta-line"><span class="field">TakerPays </span><b>CNY</b>.<a class="account" title="razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA" href="/accounts/razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA">razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA</a> decreased by<b>CN¥225.45293634</b>from<b>CN¥12,589.58241408</b>to<b>CN¥12,364.12947774</b></li>',
    )

    expect(w.find('li').at(14).html()).toBe(
      '<li class="meta-line"><span class="field">TakerGets </span><b>XRP</b> decreased by<b>\uE90050.324316</b>from<b>\uE9002,810.174646</b>to<b>\uE9002,759.85033</b></li>',
    )

    expect(w.find('li').at(15).html()).toBe(
      '<li class="meta-line">It modified a <b>CNY</b>ripplestate node between<a class="account" title="rUmustd4TbkjaEuS7S1damozpBEREgRz9z" href="/accounts/rUmustd4TbkjaEuS7S1damozpBEREgRz9z">rUmustd4TbkjaEuS7S1damozpBEREgRz9z</a>and<a class="account" title="razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA" href="/accounts/razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA">razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA</a><ul class="meta-line"><li>Balance changed by<b>CN¥225.45293634</b>from<b>CN¥187,682.19557797</b>to<b>CN¥187,907.64851431</b></li></ul></li>',
    )

    expect(w.find('li').at(16).html()).toBe(
      '<li>Balance changed by<b>CN¥225.45293634</b>from<b>CN¥187,682.19557797</b>to<b>CN¥187,907.64851431</b></li>',
    )

    expect(w.find('li').at(17).html()).toBe(
      '<li class="meta-line">It modified a <b>CNY</b>ripplestate node between<a class="account" title="rPt8rwFrsucmjdKfjwRHGz9iZGxxN2cLYh" href="/accounts/rPt8rwFrsucmjdKfjwRHGz9iZGxxN2cLYh">rPt8rwFrsucmjdKfjwRHGz9iZGxxN2cLYh</a>and<a class="account" title="rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y" href="/accounts/rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y">rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y</a><ul class="meta-line"><li>Balance changed by<b>CN¥224.7141103</b>from<b>CN¥68,093.01974027</b>to<b>CN¥68,317.73385057</b></li></ul></li>',
    )

    expect(w.find('li').at(18).html()).toBe(
      '<li>Balance changed by<b>CN¥224.7141103</b>from<b>CN¥68,093.01974027</b>to<b>CN¥68,317.73385057</b></li>',
    )

    expect(w.find('li').at(19).html()).toBe(
      '<li class="meta-line">It modified a <b>CNY</b>ripplestate node between<a class="account" title="rEGoBvzusE2MkDn3yrgZc817XiwRofqoJq" href="/accounts/rEGoBvzusE2MkDn3yrgZc817XiwRofqoJq">rEGoBvzusE2MkDn3yrgZc817XiwRofqoJq</a>and<a class="account" title="rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y" href="/accounts/rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y">rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y</a><ul class="meta-line"><li>Balance changed by<b>-CN¥224.7141103</b>from<b>CN¥9,605.02284129</b>to<b>CN¥9,380.30873099</b></li></ul></li>',
    )

    expect(w.find('li').at(20).html()).toBe(
      '<li>Balance changed by<b>-CN¥224.7141103</b>from<b>CN¥9,605.02284129</b>to<b>CN¥9,380.30873099</b></li>',
    )

    expect(w.find('li').at(21).html()).toBe(
      '<li class="meta-line">It modified a <b>CNY</b>ripplestate node between<a class="account" title="razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA" href="/accounts/razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA">razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA</a>and<a class="account" title="rPt8rwFrsucmjdKfjwRHGz9iZGxxN2cLYh" href="/accounts/rPt8rwFrsucmjdKfjwRHGz9iZGxxN2cLYh">rPt8rwFrsucmjdKfjwRHGz9iZGxxN2cLYh</a><ul class="meta-line"><li>Balance changed by<b>CN¥225.90384221</b>from<b>-CN¥225.90384221</b>to<b>CN¥0.00</b></li></ul></li>',
    )

    expect(w.find('li').at(22).html()).toBe(
      '<li>Balance changed by<b>CN¥225.90384221</b>from<b>-CN¥225.90384221</b>to<b>CN¥0.00</b></li>',
    )

    w.unmount()
  })

  it('renders OfferCancel Meta', () => {
    const w = createWrapper(OfferCancel)
    expect(w.find('.title').length).toBe(1)
    expect(w.find('.meta-section').length).toBe(2)
    expect(w.contains(<div>number_of_affected_node</div>)).toBe(true)
    expect(w.contains(<div className="meta-title">nodes_type</div>)).toBe(true)
    expect(w.find('li').length).toBe(6)
  })

  it('renders OfferCreate Meta with missing PreviousFields', () => {
    const w = createWrapper(OfferCreateWithMissingPreviousFields)
    expect(w.find('.title').length).toBe(1)
    expect(w.find('.meta-section').length).toBe(2)
    expect(w.contains(<div>number_of_affected_node</div>)).toBe(true)
    expect(w.contains(<div className="meta-title">nodes_type</div>)).toBe(true)
    expect(w.find('li').length).toBe(5291)
  })

  it('renders PayChannel Meta', () => {
    const w = createWrapper(PaymentChannelClaim)
    expect(w.find('.title').length).toBe(1)
    expect(w.find('.meta-section').length).toBe(1)
    expect(w.contains(<div>number_of_affected_node</div>)).toBe(true)
    expect(w.contains(<div className="meta-title">nodes_type</div>)).toBe(true)
    expect(w.find('li').length).toBe(4)
  })
})
