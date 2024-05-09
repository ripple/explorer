import { cleanup, screen } from '@testing-library/react'
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

const renderComponent = createSimpleRenderFactory(Simple)

describe('AMM Withdraw Tests', () => {
  afterEach(cleanup)

  it('renders from transaction', () => {
    renderComponent(withdrawMock)
    expectSimpleRowText(screen, 'asset1', '\uE9003,666.580862 XRP')
    expectSimpleRowText(
      screen,
      'asset2',
      '$4,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      screen,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
  })

  it('renders transaction from usd only', () => {
    renderComponent(withdrawUSDMock)
    expectSimpleRowNotToExist(screen, 'asset1')
    expectSimpleRowText(
      screen,
      'asset2',
      '$100.00 USD.rA3nNmhWKRZvcsA89DxTRbV62JiaSZWdy',
    )
    expectSimpleRowText(
      screen,
      'account_id',
      'rHrzrzVHSyunKzW3JLgSaLcsxfwVLPVV97',
    )
  })
  it('renders transaction from XRP only', () => {
    renderComponent(withdrawXRPMock)
    expectSimpleRowNotToExist(screen, 'asset2')
    expectSimpleRowText(screen, 'asset1', '\uE90099.99998 XRP')
    expectSimpleRowText(
      screen,
      'account_id',
      'rHrzrzVHSyunKzW3JLgSaLcsxfwVLPVV97',
    )
  })

  it('renders transaction from eprice', () => {
    renderComponent(withdrawEpriceMock)
    expectSimpleRowNotToExist(screen, 'asset1')
    expectSimpleRowText(
      screen,
      'asset2',
      '$1,639.41097028 USD.rA3nNmhWKRZvcsA89DxTRbV62JiaSZWdy',
    )
    expectSimpleRowText(
      screen,
      'account_id',
      'rHrzrzVHSyunKzW3JLgSaLcsxfwVLPVV97',
    )
  })
})
