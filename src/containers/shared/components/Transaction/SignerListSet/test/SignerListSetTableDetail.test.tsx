import { cleanup, screen } from '@testing-library/react'
import { TableDetail } from '../TableDetail'
import mockSignerListSetClear from './mock_data/SignerListSetClear.json'
import mockSignerListSet from './mock_data/SignerListSet.json'

import { createTableDetailRenderFactory } from '../../test'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('SignerListSet: TableDetail', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockSignerListSet)
    expect(wrapper).toHaveText('signers: 3 - quorum: 3/4')
  })

  it('renders when signer list is cleared', () => {
    renderComponent(mockSignerListSetClear)
    expect(wrapper).toHaveText('unset_signer_list')
  })
})
