import { Simple } from '../Simple'
import {
  createSimpleRenderFactory,
  expectSimpleRowNotToExist,
  expectSimpleRowText,
} from '../../test'
import withdrawMock from './mock_data/withdraw.json'
import withdrawUSDMock from './mock_data/withdraw_usd.json'
import withdrawXRPMock from './mock_data/withdraw_xrp.json'
import withdrawEpriceMock from './mock_data/withdraw_eprice.json'
import withdrawAll from './mock_data/withdraw_all.json'

describe('AMM Withdraw Tests', () => {
  const renderComponent = createSimpleRenderFactory(Simple)

  it('renders from transaction', () => {
    const { container, unmount } = renderComponent(withdrawMock)
    expectSimpleRowText(container, 'asset1', '\uE9003,666.580862 XRP')
    expectSimpleRowText(
      container,
      'asset2',
      '$4,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      container,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    unmount()
  })

  it('renders transaction from usd only', () => {
    const { container, unmount } = renderComponent(withdrawUSDMock)
    expectSimpleRowNotToExist(container, 'asset1')
    expectSimpleRowText(
      container,
      'asset2',
      '$100.00 USD.rA3nNmhWKRZvcsA89DxTRbV62JiaSZWdy',
    )
    expectSimpleRowText(
      container,
      'account_id',
      'rHrzrzVHSyunKzW3JLgSaLcsxfwVLPVV97',
    )
    unmount()
  })
  it('renders transaction from XRP only', () => {
    const { container, unmount } = renderComponent(withdrawXRPMock)
    expectSimpleRowNotToExist(container, 'asset2')
    expectSimpleRowText(container, 'asset1', '\uE90099.99998 XRP')
    expectSimpleRowText(
      container,
      'account_id',
      'rHrzrzVHSyunKzW3JLgSaLcsxfwVLPVV97',
    )
    unmount()
  })

  it('renders transaction from eprice', () => {
    const { container, unmount } = renderComponent(withdrawEpriceMock)
    expectSimpleRowNotToExist(container, 'asset1')
    expectSimpleRowText(
      container,
      'asset2',
      '$1,639.41097028 USD.rA3nNmhWKRZvcsA89DxTRbV62JiaSZWdy',
    )
    expectSimpleRowText(
      container,
      'account_id',
      'rHrzrzVHSyunKzW3JLgSaLcsxfwVLPVV97',
    )
    unmount()
  })

  it('renders LP Tokens properly', () => {
    const { container, unmount } = renderComponent(withdrawAll)
    expectSimpleRowText(container, 'lp_tokens', '4.77')
    unmount()
  })

  it('renders positive XRP amount even if transaction fee is greater than XRP taken out of AMM', () => {
    const { container, unmount } = renderComponent(withdrawAll)
    expectSimpleRowNotToExist(container, 'asset2')
    expectSimpleRowText(container, 'asset1', '\uE9000.000005 XRP')
    unmount()
  })
})
