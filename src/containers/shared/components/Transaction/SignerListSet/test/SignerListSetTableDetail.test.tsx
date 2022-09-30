import React from 'react'

import { TableDetail } from '../TableDetail'
import mockSignerListSetClear from './mock_data/SignerListSetClear.json'
import mockSignerListSet from './mock_data/SignerListSet.json'

import { createTableDetailWrapperFactory } from '../../test'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('SignerListSet: TableDetail', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockSignerListSet)
    expect(wrapper).toHaveText('signers: 3 - quorum: 3/4')
    wrapper.unmount()
  })

  it('renders when signer list is cleared', () => {
    const wrapper = createWrapper(mockSignerListSetClear)
    expect(wrapper).toHaveText('unset_signer_list')
    wrapper.unmount()
  })
})
