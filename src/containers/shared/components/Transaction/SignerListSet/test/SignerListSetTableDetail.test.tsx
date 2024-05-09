import { cleanup, screen } from '@testing-library/react'
import { TableDetail } from '../TableDetail'
import mockSignerListSetClear from './mock_data/SignerListSetClear.json'
import mockSignerListSet from './mock_data/SignerListSet.json'

import { createTableDetailRenderFactory } from '../../test'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('SignerListSet: TableDetail', () => {
  afterEach(cleanup)
  it('renders', () => {
    const { container } = renderComponent(mockSignerListSet)
    expect(container).toHaveTextContent('signers: 3 - quorum: 3/4')
  })

  it('renders when signer list is cleared', () => {
    const { container } = renderComponent(mockSignerListSetClear)
    expect(container).toHaveTextContent('unset_signer_list')
  })
})
