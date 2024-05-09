import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import {
  createSimpleRenderFactory,
  expectSimpleRowNotToExist,
  expectSimpleRowText,
} from '../../test'
import depositBothAssets from './mock_data/deposit_both.json'
import depositUSD from './mock_data/deposit_usd.json'
import depositXRP from './mock_data/deposit_xrp.json'
import depositEprice from './mock_data/deposit_eprice.json'
import depositNonXRP from './mock_data/deposit_nonxrp.json'
import depositFail from './mock_data/deposit_fail.json'

describe('AMM Deposit Tests', () => {
  const renderComponent = createSimpleRenderFactory(Simple)

  it('renders with both assets', () => {
    renderComponent(depositBothAssets)
    expectSimpleRowText(wrapper, 'asset1', '\uE90010,997.290462 XRP')
    expectSimpleRowText(
      wrapper,
      'asset2',
      '$10,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })

  it('renders only with USD', () => {
    renderComponent(depositUSD)
    expectSimpleRowNotToExist(wrapper, 'asset1')
    expectSimpleRowText(
      wrapper,
      'asset2',
      '$2,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })

  it('renders only with XRP', () => {
    renderComponent(depositXRP)
    expectSimpleRowText(wrapper, 'asset1', '\uE9001,000.00 XRP')
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })

  it('renders with eprice', () => {
    renderComponent(depositEprice)
    expectSimpleRowNotToExist(wrapper, 'asset1')
    expectSimpleRowText(
      wrapper,
      'asset2',
      '$1,000.00 USD.rA3nNmhWKRZvcsA89DxTRbV62JiaSZWdy',
    )
    expectSimpleRowText(
      wrapper,
      'effective_price',
      '$0.10 USD.rA3nNmhWKRZvcsA89DxTRbV62JiaSZWdy',
    )
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rHrzrzVHSyunKzW3JLgSaLcsxfwVLPVV97',
    )
    wrapper.unmount()
  })

  it('renders with both assets non XRP', () => {
    renderComponent(depositNonXRP)
    expectSimpleRowText(
      wrapper,
      'asset1',
      '€500.00 EUR.rEaiyQKvxYWmh7q9mvSm11kZmKx92HZdmr',
    )
    expectSimpleRowText(
      wrapper,
      'asset2',
      '$500.00 USD.rEaiyQKvxYWmh7q9mvSm11kZmKx92HZdmr',
    )
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rEJ1X5BoSmHqa5h6TSVvYrHAzFmyxGqNic',
    )
    wrapper.unmount()
  })

  it('deposit shouldnt crash with tx that changes fee', () => {
    renderComponent(depositFail)
    expectSimpleRowNotToExist(wrapper, 'asset1')
    expectSimpleRowNotToExist(wrapper, 'asset2')
    expectSimpleRowNotToExist(wrapper, 'account_id')
    wrapper.unmount()
  })
})
