import React from 'react'
import { mount } from 'enzyme'
import { NFTokenBurn } from '../Simple'
import transaction from './mock_data/NFTokenBurn.json'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'

describe('NFTokenBurn', () => {
  it('handles NFTokenBurn simple view ', () => {
    const wrapper = mount(
      <NFTokenBurn data={summarizeTransaction(transaction, true).details} />,
    )
    expect(wrapper.find('[data-test="token-id"] .value')).toHaveText(
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C29ABA6A90000000D',
    )
    wrapper.unmount()
  })
})
