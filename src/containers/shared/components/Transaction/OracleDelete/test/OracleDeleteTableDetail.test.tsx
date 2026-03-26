import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import OracleDelete from './mock_data/OracleDelete.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('OracleDelete: TableDetail', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(OracleDelete)
    expect(container).toHaveTextContent('oracle_document_id: 1')
    unmount()
  })
})
