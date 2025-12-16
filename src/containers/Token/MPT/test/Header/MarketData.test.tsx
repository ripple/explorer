import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../../i18n/testConfig'
import { MarketData } from '../../Header/MarketData'

describe('MarketData component', () => {
  const createWrapper = (props: any = {}) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <MarketData
          maxAmt={props.maxAmt}
          outstandingAmt={props.outstandingAmt}
          assetScale={props.assetScale}
        />
      </I18nextProvider>,
    )

  it('renders header box', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.header-box').length).toBe(1)
    expect(wrapper.find('.header-box-title').text()).toBe(
      'token_page.market_data',
    )
    wrapper.unmount()
  })

  it('displays supply label', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('token_page.supply')
    wrapper.unmount()
  })

  it('displays circulating supply label', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('token_page.circulating_supply')
    wrapper.unmount()
  })

  it('displays formatted max amount with scale 0', () => {
    const wrapper = createWrapper({
      maxAmt: '1000000',
      assetScale: 0,
    })
    // parseAmount abbreviates large numbers
    expect(wrapper.text()).toContain('1.0M')
    wrapper.unmount()
  })

  it('displays formatted max amount with scale 2', () => {
    const wrapper = createWrapper({
      maxAmt: '100000000',
      assetScale: 2,
    })
    // 100000000 with scale 2 = 1000000, formatted as 1.0M
    expect(wrapper.text()).toContain('1.0M')
    wrapper.unmount()
  })

  it('displays formatted outstanding amount', () => {
    const wrapper = createWrapper({
      outstandingAmt: '5000000',
      assetScale: 0,
    })
    // parseAmount abbreviates large numbers
    expect(wrapper.text()).toContain('5.0M')
    wrapper.unmount()
  })

  it('displays 0 for undefined amounts', () => {
    const wrapper = createWrapper({
      maxAmt: undefined,
      outstandingAmt: undefined,
      assetScale: undefined,
    })
    expect(wrapper.text()).toContain('0')
    wrapper.unmount()
  })

  it('displays market cap placeholder', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('token_page.market_cap')
    expect(wrapper.text()).toContain('--')
    wrapper.unmount()
  })

  it('displays volume 24h placeholder', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('token_page.volume_24h')
    wrapper.unmount()
  })

  it('displays trades 24h placeholder', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('token_page.trades_24h')
    wrapper.unmount()
  })

  it('displays AMM TVL placeholder', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('token_page.amm_tvl')
    wrapper.unmount()
  })
})
