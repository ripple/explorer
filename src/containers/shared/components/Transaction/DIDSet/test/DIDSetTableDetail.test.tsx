import { cleanup } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import DIDSet from './mock_data/DIDSet.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('DIDSet: TableDetail', () => {
  afterEach(cleanup)
  it('renders', () => {
    const { container } = renderComponent(DIDSet)
    // eslint-disable-next-line no-useless-concat -- easier to read this way
    expect(container).toHaveTextContent(
      'uri: did_example' + 'did_document: doc',
    )
  })
})
