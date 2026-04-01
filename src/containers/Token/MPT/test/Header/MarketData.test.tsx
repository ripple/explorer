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

  it('displays supply label', () => {
    const { container } = renderComponent()
    expect(container).toHaveTextContent('token_page.supply')
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

  it('displays 0 for undefined amounts', () => {
    const { container } = renderComponent({
      maxAmt: undefined,
      outstandingAmt: undefined,
      assetScale: undefined,
    })
    expect(container).toHaveTextContent('0')
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
})
