import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import mockXChainCommit from './mock_data/XChainCommit.json'
import mockXChainCommitInsufficientFunds from './mock_data/XChainCommitInsufficientFunds.json'

import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainCommitSimple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockXChainCommit)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(screen.getByTestId('locking-chain-door')).toHaveAttribute('href')
    expectSimpleRowText(screen, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      screen,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(screen.getByTestId('issuing-chain-door')).not.toHaveAttribute('href')
    expectSimpleRowText(screen, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(screen, 'send', '\uE90010.00 XRP')
    expectSimpleRowText(screen, 'claim-id', '4')
    expect(screen.queryByTestId('destination')).toBeNull()
  })

  it('renders failed tx', () => {
    renderComponent(mockXChainCommitInsufficientFunds)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(screen.getByTestId('locking-chain-door')).not.toHaveAttribute('href')
    expectSimpleRowText(screen, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      screen,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(screen.getByTestId('issuing-chain-door')).not.toHaveAttribute('href')
    expectSimpleRowText(screen, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(screen, 'send', '\uE90010,000.00 XRP')
    expectSimpleRowText(screen, 'claim-id', '3')
    expectSimpleRowText(
      screen,
      'destination',
      'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi',
    )
  })
})
