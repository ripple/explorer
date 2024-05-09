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

describe('AMM Withdraw Tests', () => {
  const createWrapper = createSimpleRenderFactory(Simple)

  it('renders from transaction', () => {
    const wrapper = createWrapper(withdrawMock)
    expectSimpleRowText(wrapper, 'asset1', '\uE9003,666.580862 XRP')
    expectSimpleRowText(
      wrapper,
      'asset2',
      '$4,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })

  it('renders transaction from usd only', () => {
    const wrapper = createWrapper(withdrawUSDMock)
    expectSimpleRowNotToExist(wrapper, 'asset1')
    expectSimpleRowText(
      wrapper,
      'asset2',
      '$100.00 USD.rA3nNmhWKRZvcsA89DxTRbV62JiaSZWdy',
    )
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rHrzrzVHSyunKzW3JLgSaLcsxfwVLPVV97',
    )
    wrapper.unmount()
  })
  it('renders transaction from XRP only', () => {
    const wrapper = createWrapper(withdrawXRPMock)
    expectSimpleRowNotToExist(wrapper, 'asset2')
    expectSimpleRowText(wrapper, 'asset1', '\uE90099.99998 XRP')
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rHrzrzVHSyunKzW3JLgSaLcsxfwVLPVV97',
    )
    wrapper.unmount()
  })

  it('renders transaction from eprice', () => {
    const wrapper = createWrapper(withdrawEpriceMock)
    expectSimpleRowNotToExist(wrapper, 'asset1')
    expectSimpleRowText(
      wrapper,
      'asset2',
      '$1,639.41097028 USD.rA3nNmhWKRZvcsA89DxTRbV62JiaSZWdy',
    )
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rHrzrzVHSyunKzW3JLgSaLcsxfwVLPVV97',
    )
    wrapper.unmount()
  })
})
