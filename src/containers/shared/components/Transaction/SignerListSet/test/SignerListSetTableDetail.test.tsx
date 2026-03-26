import { TableDetail } from '../TableDetail'
import mockSignerListSetClear from './mock_data/SignerListSetClear.json'
import mockSignerListSet from './mock_data/SignerListSet.json'

import { createTableDetailRenderFactory } from '../../test'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('SignerListSet: TableDetail', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockSignerListSet)
    expect(container).toHaveTextContent('signers: 3 - quorum: 3/4')
    unmount()
  })

  it('renders when signer list is cleared', () => {
    const { container, unmount } = renderComponent(mockSignerListSetClear)
    expect(container).toHaveTextContent('unset_signer_list')
    unmount()
  })
})
