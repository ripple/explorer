import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../../i18n/testConfig'
import { MarketData } from '../../Header/MarketData'

describe('MarketData component', () => {
  const renderComponent = (props: any = {}) =>
    render(
      <I18nextProvider i18n={i18n}>
        <MarketData
          maxAmt={props.maxAmt}
          outstandingAmt={props.outstandingAmt}
          confidentialOutstandingAmt={props.confidentialOutstandingAmt}
          assetScale={props.assetScale}
        />
      </I18nextProvider>,
    )

  it('renders header box', () => {
    const { container } = renderComponent()
    expect(container.querySelectorAll('.header-box')).toHaveLength(1)
    expect(container.querySelector('.header-box-title')).toHaveTextContent(
      'token_page.market_data',
    )
  })

  it('displays max supply label', () => {
    const { container } = renderComponent()
    expect(container).toHaveTextContent('token_page.max_supply')
  })

  it('displays circulating supply label', () => {
    const { container } = renderComponent()
    expect(container).toHaveTextContent('token_page.circulating_supply')
  })

  it('displays formatted max amount with scale 0', () => {
    const { container } = renderComponent({
      maxAmt: '1000000',
      assetScale: 0,
    })
    // parseAmount abbreviates large numbers
    expect(container).toHaveTextContent('1.0M')
  })

  it('displays formatted max amount with scale 2', () => {
    const { container } = renderComponent({
      maxAmt: '100000000',
      assetScale: 2,
    })
    // 100000000 with scale 2 = 1000000, formatted as 1.0M
    expect(container).toHaveTextContent('1.0M')
  })

  it('displays formatted outstanding amount', () => {
    const { container } = renderComponent({
      outstandingAmt: '5000000',
      assetScale: 0,
    })
    // parseAmount abbreviates large numbers
    expect(container).toHaveTextContent('5.0M')
  })

  it('displays circulating supply of 0 for undefined outstanding amount', () => {
    const { container } = renderComponent({
      maxAmt: '1000000',
      outstandingAmt: undefined,
      assetScale: 0,
    })
    expect(container).toHaveTextContent('0.00')
  })

  it('falls back to the max 63-bit cap for supply when maxAmt is undefined', () => {
    // MaximumAmount is optional on-chain; when absent the cap is 2^63 - 1.
    // Supply must reflect that cap so it is never shown as less than the
    // circulating (outstanding) amount.
    const { container } = renderComponent({
      maxAmt: undefined,
      outstandingAmt: '281380138',
      assetScale: 7,
    })
    // 9223372036854775807 / 10^7 -> ~922.3 billion
    expect(container).toHaveTextContent('922.3B')
    // circulating: 281380138 / 10^7 = 28.138...
    expect(container).toHaveTextContent('28.14')
  })

  it('displays market cap placeholder', () => {
    const { container } = renderComponent()
    expect(container).toHaveTextContent('token_page.market_cap')
    expect(container).toHaveTextContent('--')
  })

  it('displays volume 24h placeholder', () => {
    const { container } = renderComponent()
    expect(container).toHaveTextContent('token_page.volume_24h')
  })

  it('displays trades 24h placeholder', () => {
    const { container } = renderComponent()
    expect(container).toHaveTextContent('token_page.trades_24h')
  })

  it('displays AMM TVL placeholder', () => {
    const { container } = renderComponent()
    expect(container).toHaveTextContent('token_page.amm_tvl')
  })

  it('does not display confidential balances when not provided', () => {
    const { container } = renderComponent()
    expect(container).not.toHaveTextContent('token_page.confidential_balances')
  })

  it('displays confidential balances when provided', () => {
    const { container } = renderComponent({
      confidentialOutstandingAmt: '100000',
      assetScale: 2,
    })
    expect(container).toHaveTextContent('token_page.confidential_balances')
    expect(container).toHaveTextContent('1,000')
  })

  it('displays formatted confidential balances with scale 0', () => {
    const { container } = renderComponent({
      confidentialOutstandingAmt: '5000000',
      assetScale: 0,
    })
    expect(container).toHaveTextContent('token_page.confidential_balances')
    expect(container).toHaveTextContent('5.0M')
  })
})
