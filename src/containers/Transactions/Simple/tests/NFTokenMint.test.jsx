import React from 'react'
import { mount } from 'enzyme'
import { NFTokenMint } from '../NFTokenMint'
import transaction from '../../test/mock_data/NFTokenMint.json'
import summarizeTransaction from '../../../../rippled/lib/txSummary'

describe('NFTokenMint', () => {
  it('handles NFTokenMint simple view ', () => {
    const wrapper = mount(
      <NFTokenMint data={summarizeTransaction(transaction, true).details} />,
    )
    expect(wrapper.find('[data-test="token-id"]')).toHaveText(
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C535743B40000001A',
    )
    expect(wrapper.find('[data-test="token-taxon"]')).toHaveText('1')
    expect(wrapper.find('[data-test="token-uri"]')).toHaveText(
      'https://gregweisbrod.com',
    )
    wrapper.unmount()
  })
})
