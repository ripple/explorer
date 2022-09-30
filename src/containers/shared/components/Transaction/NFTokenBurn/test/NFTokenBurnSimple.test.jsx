import React from 'react'

import { createSimpleWrapperFactory } from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/NFTokenBurn.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('NFTokenBurn', () => {
  it('handles NFTokenBurn simple view ', () => {
    const wrapper = createWrapper(transaction)
    expect(wrapper.find('[data-test="token-id"] .value')).toHaveText(
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C29ABA6A90000000D',
    )
    wrapper.unmount()
  })
})
