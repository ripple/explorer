import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../../i18n/testConfig'
import { MarketData } from '../../Header/MarketData'

describe('MarketData component', () => {
  const renderComponent = (props: any = {}) =>
    render(
      <I18nextProvider i18n={i18n}>
        <MarketData
          outstandingAmt={props.outstandingAmt}
          confidentialOutstandingAmt={props.confidentialOutstandingAmt}
          assetScale={props.assetScale}
          circulatingSupply={props.circulatingSupply}
          circulatingSupplyLoading={props.circulatingSupplyLoading}
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

  it('displays supply label', () => {
    const { container } = renderComponent()
    expect(container).toHaveTextContent('token_page.supply')
  })

  it('displays circulating supply label', () => {
    const { container } = renderComponent()
    expect(container).toHaveTextContent('token_page.circulating_supply')
  })

  it('shows Supply from the outstanding amount', () => {
    const { container } = renderComponent({
      outstandingAmt: '5000000',
      assetScale: 0,
    })
    const values = container.querySelectorAll('.item-value')
    // Row 0 = Supply.
    expect(values[0]).toHaveTextContent('5.0M')
  })

  it('shows Circ Supply from the circulatingSupply prop, distinct from Supply', () => {
    const { container } = renderComponent({
      outstandingAmt: '5000000',
      circulatingSupply: '3000000',
      assetScale: 0,
    })
    const values = container.querySelectorAll('.item-value')
    expect(values[0]).toHaveTextContent('5.0M') // Supply = outstanding
    expect(values[1]).toHaveTextContent('3.0M') // Circ Supply = prop
  })

  it('shows -- for Circ Supply when it is unavailable (e.g. holders failed)', () => {
    const { container } = renderComponent({
      outstandingAmt: '5000000',
      circulatingSupply: undefined,
      assetScale: 0,
    })
    const values = container.querySelectorAll('.item-value')
    // Supply still renders; Circ Supply must not silently show the unadjusted
    // supply, which would look like a real circulating figure.
    expect(values[0]).toHaveTextContent('5.0M')
    expect(values[1]).toHaveTextContent('--')
  })

  it('shows a spinner for Circ Supply while it is loading', () => {
    const { container } = renderComponent({
      outstandingAmt: '5000000',
      circulatingSupplyLoading: true,
      assetScale: 0,
    })
    const values = container.querySelectorAll('.item-value')
    // Supply still renders; Circ Supply shows a spinner instead of a value.
    expect(values[0]).toHaveTextContent('5.0M')
    expect(values[1].querySelectorAll('.loading-spinner')).toHaveLength(1)
  })

  it('defaults an undefined asset scale to 0', () => {
    const { container } = renderComponent({
      outstandingAmt: '5000000',
      circulatingSupply: '5000000',
      assetScale: undefined,
    })
    const values = container.querySelectorAll('.item-value')
    expect(values[0]).toHaveTextContent('5.0M')
    expect(values[1]).toHaveTextContent('5.0M')
  })

  it('shows -- instead of a formatted zero for Supply and Circ Supply', () => {
    const { container } = renderComponent({
      outstandingAmt: undefined,
      circulatingSupply: '0',
      assetScale: 0,
    })
    const values = container.querySelectorAll('.item-value')
    // A zero supply is not a meaningful figure, so neither row shows "0.00".
    expect(values[0]).toHaveTextContent('--')
    expect(values[1]).toHaveTextContent('--')
    expect(container).not.toHaveTextContent('0.00')
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
