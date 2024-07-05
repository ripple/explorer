import { cleanup, screen } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import OracleSet from './mock_data/OracleSet.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('OracleDelete: TableDetail', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(OracleSet)
    expect(screen.getByTestId('table-detail')).toHaveTextContent(
      'oracle_document_id: 1' +
        'provider: provider' +
        'asset_class: currency' +
        'last_update_time: May 13, 2024 at 9:05:10 PM' +
        'trading_pairs: 74.2\uE900 XRP/USD, 1.03BTC/AUDT',
    )
  })
})
