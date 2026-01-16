import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockXChainAccountCreateCommit from './mock_data/XChainAccountCreateCommit.json'
import mockXChainAccountCreateCommitInsufficientFunds from './mock_data/XChainAccountCreateCommitInsufficientFunds.json'
import { expectSimpleRowText } from '../../test/expectations'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainAccountCreateCommitSimple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockXChainAccountCreateCommit)

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
    expectSimpleRowText(
      container,
      'destination',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expect(container.querySelector('[data-testid="destination"] a')).not.toBeInTheDocument()
  })

  it('renders failed transaction', () => {
    const { container, unmount } = renderComponent(
      mockXChainAccountCreateCommitInsufficientFunds,
    )

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

    expectSimpleRowText(container, 'send', '\uE9001,000.00 XRP')
    expectSimpleRowText(
      container,
      'destination',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expect(container.querySelector('[data-testid="destination"] a')).not.toBeInTheDocument()
  })
})
