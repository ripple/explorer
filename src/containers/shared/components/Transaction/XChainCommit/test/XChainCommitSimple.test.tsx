import { Simple } from '../Simple'
import mockXChainCommit from './mock_data/XChainCommit.json'
import mockXChainCommitInsufficientFunds from './mock_data/XChainCommitInsufficientFunds.json'

import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainCommitSimple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockXChainCommit)

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(container.querySelector('[data-testid="locking-chain-door"] a')).toBeInTheDocument()
    expectSimpleRowText(container, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      container,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(container.querySelector('[data-testid="issuing-chain-door"] a')).not.toBeInTheDocument()
    expectSimpleRowText(container, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(container, 'send', '\uE90010.00 XRP')
    expectSimpleRowText(container, 'claim-id', '4')
    expect(container.querySelector('[data-testid="destination"]')).not.toBeInTheDocument()
  })

  it('renders failed tx', () => {
    const { container, unmount } = renderComponent(mockXChainCommitInsufficientFunds)

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(container.querySelector('[data-testid="locking-chain-door"] a')).not.toBeInTheDocument()
    expectSimpleRowText(container, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      container,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(container.querySelector('[data-testid="issuing-chain-door"] a')).not.toBeInTheDocument()
    expectSimpleRowText(container, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(container, 'send', '\uE90010,000.00 XRP')
    expectSimpleRowText(container, 'claim-id', '3')
    expectSimpleRowText(
      container,
      'destination',
      'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi',
    )
  })
})
