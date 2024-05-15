import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import OracleSet from './mock_data/OracleSet.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('OracleDelete: TableDetail', () => {
  it('renders', () => {
    const wrapper = createWrapper(OracleSet)
    expect(wrapper).toHaveText(
      'oracle_document_id: 1' +
        'provider: provider' +
        'last_update_time: May 13, 2024, 9:05:10 PM' +
        'asset_class: currency' +
        'trading_pair XRP/USD' +
        'asset_price 74.00000' +
        ', ' +
        'trading_pair BTC/EUR' +
        'asset_price 1.00000',
    )
    wrapper.unmount()
  })
})
