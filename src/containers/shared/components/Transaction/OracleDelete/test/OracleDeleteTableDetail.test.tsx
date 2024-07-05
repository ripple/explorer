import { screen, cleanup } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import OracleDelete from './mock_data/OracleDelete.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('OracleDelete: TableDetail', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(OracleDelete)
    expect(screen.getByTestId('oracle-document-id')).toHaveTextContent(
      `oracle_document_id: 1`,
    )
  })
})
