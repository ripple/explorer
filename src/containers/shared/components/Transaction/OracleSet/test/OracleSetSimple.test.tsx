import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import OracleSet from './mock_data/OracleSet.json'

const renderComponent = createSimpleRenderFactory(Simple)
describe('OracleSet: Simple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(OracleSet)
    expectSimpleRowText(screen, 'oracle-document-id', '1')
    expectSimpleRowText(screen, 'provider', 'provider')
    expectSimpleRowText(
      screen,
      'last-update-time',
      'May 13, 2024 at 9:05:10 PM',
    )
    expectSimpleRowText(screen, 'asset-class', 'currency')
    expectSimpleRowText(
      screen,
      'trading-pairs',
      '74.2\uE900 XRP/USD1.03BTC/AUDT',
    )
  })
})
