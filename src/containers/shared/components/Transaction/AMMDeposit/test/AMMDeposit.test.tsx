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

const renderComponent = createSimpleRenderFactory(Simple)

describe('AMM Deposit Tests', () => {
  afterEach(cleanup)

  it('renders with both assets', () => {
    renderComponent(depositBothAssets)
    expectSimpleRowText(screen, 'asset1', '\uE90010,997.290462 XRP')
    expectSimpleRowText(
      screen,
      'asset2',
      '$10,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      screen,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
  })

  it('renders only with USD', () => {
    renderComponent(depositUSD)
    expectSimpleRowNotToExist(screen, 'asset1')
    expectSimpleRowText(
      screen,
      'asset2',
      '$2,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      screen,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
  })

  it('renders only with XRP', () => {
    renderComponent(depositXRP)
    expectSimpleRowText(screen, 'asset1', '\uE9001,000.00 XRP')
    expectSimpleRowText(
      screen,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
  })

  it('renders with eprice', () => {
    renderComponent(depositEprice)
    expectSimpleRowNotToExist(screen, 'asset1')
    expectSimpleRowText(
      screen,
      'asset2',
      '$1,000.00 USD.rA3nNmhWKRZvcsA89DxTRbV62JiaSZWdy',
    )
    expectSimpleRowText(
      screen,
      'effective_price',
      '$0.10 USD.rA3nNmhWKRZvcsA89DxTRbV62JiaSZWdy',
    )
    expectSimpleRowText(
      screen,
      'account_id',
      'rHrzrzVHSyunKzW3JLgSaLcsxfwVLPVV97',
    )
  })

  it('renders with both assets non XRP', () => {
    renderComponent(depositNonXRP)
    expectSimpleRowText(
      screen,
      'asset1',
      '€500.00 EUR.rEaiyQKvxYWmh7q9mvSm11kZmKx92HZdmr',
    )
    expectSimpleRowText(
      screen,
      'asset2',
      '$500.00 USD.rEaiyQKvxYWmh7q9mvSm11kZmKx92HZdmr',
    )
    expectSimpleRowText(
      screen,
      'account_id',
      'rEJ1X5BoSmHqa5h6TSVvYrHAzFmyxGqNic',
    )
  })

  it('deposit shouldnt crash with tx that changes fee', () => {
    renderComponent(depositFail)
    expectSimpleRowNotToExist(screen, 'asset1')
    expectSimpleRowNotToExist(screen, 'asset2')
    expectSimpleRowNotToExist(screen, 'account_id')
  })
})
