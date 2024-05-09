import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import mockXChainModifyBridge from './mock_data/XChainModifyBridge.json'
import mockXChainModifyBridgeMinAccountCreateAmount from './mock_data/XChainModifyBridgeMinAccountCreateAmount.json'
import mockXChainModifyBridgeNoEntry from './mock_data/XChainModifyBridgeNoEntry.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainModifyBridgeSimple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockXChainModifyBridge)

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
    expect(screen.getByTestId('issuing-chain-door')).toHaveAttribute('href')
    expectSimpleRowText(screen, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(screen, 'signature-reward', '\uE9000.01 XRP')
  })

  it('renders MinAccountCreateAmount', () => {
    renderComponent(mockXChainModifyBridgeMinAccountCreateAmount)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'rnBnyot2gCJywLxLzfHQX2dUJqZ6oghUFp',
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

    expectSimpleRowText(screen, 'min-account-create-amount', '\uE900100.00 XRP')
  })

  it('renders failed transaction', () => {
    renderComponent(mockXChainModifyBridgeNoEntry)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'r3rhWeE31Jt5sWmi4QiGLMZnY3ENgqw96W',
    )
    expect(screen.getByTestId('locking-chain-door')).not.toHaveAttribute('href')
    expectSimpleRowText(screen, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      screen,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(screen.getByTestId('issuing-chain-door')).toHaveAttribute('href')
    expectSimpleRowText(screen, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(screen, 'signature-reward', '\uE9000.0001 XRP')
  })
})
