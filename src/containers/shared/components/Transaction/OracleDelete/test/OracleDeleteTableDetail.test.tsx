import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import OracleDelete from './mock_data/OracleDelete.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('OracleDelete: TableDetail', () => {
  it('renders', () => {
    const wrapper = createWrapper(OracleDelete)
    expect(wrapper).toHaveText('oracle_document_id: 1')
    wrapper.unmount()
  })
})
