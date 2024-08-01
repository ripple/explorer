import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import mockXChainCreateBridge from './mock_data/XChainCreateBridge.json'
import mockXChainCreateBridgeFailed from './mock_data/XChainCreateBridgeFailed.json'
import mockXChainCreateBridgeIOU from './mock_data/XChainCreateBridgeIOU.json'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainCreateBridgeSimple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockXChainCreateBridge)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(
      screen.getByText('rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR'),
    ).not.toHaveAttribute('href')
    expectSimpleRowText(screen, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      screen,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(
      screen.getByText('rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'),
    ).toHaveAttribute('href')
    expectSimpleRowText(screen, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(screen, 'signature-reward', '\uE9000.0001 XRP')
    expect(screen.queryByTestId('min-create-account-amount')).toBeNull()
  })

  it('renders IOU bridge', () => {
    renderComponent(mockXChainCreateBridgeIOU)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'ratAutb3katzezbXX3LsX4sk4vmvhNucac',
    )
    expect(
      screen.getByText('ratAutb3katzezbXX3LsX4sk4vmvhNucac'),
    ).not.toHaveAttribute('href')
    expectSimpleRowText(
      screen,
      'locking-chain-issue',
      'USD.rNhm2aTLEnSdcWQ7d6PZ5F7TX5skM7wkAS',
    )
    expectSimpleRowText(
      screen,
      'issuing-chain-door',
      'rBkRN2VHVWJVKqfnh1TovLkXo7vLP7oBcq',
    )
    expect(
      screen.getByText('rBkRN2VHVWJVKqfnh1TovLkXo7vLP7oBcq'),
    ).toHaveAttribute('href')
    expectSimpleRowText(
      screen,
      'issuing-chain-issue',
      'USD.rBkRN2VHVWJVKqfnh1TovLkXo7vLP7oBcq',
    )

    expectSimpleRowText(screen, 'signature-reward', '\uE9000.0001 XRP')
    expectSimpleRowText(screen, 'min-account-create-amount', '\uE9005.00 XRP')
  })

  it('renders failed tx', () => {
    renderComponent(mockXChainCreateBridgeFailed)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'rNFrsx478pH42Vy5w4KN9Hcyh8SDrVmCfd',
    )
    expect(
      screen.getByText('rNFrsx478pH42Vy5w4KN9Hcyh8SDrVmCfd'),
    ).toHaveAttribute('href')
    expectSimpleRowText(screen, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      screen,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(
      screen.getByText('rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'),
    ).not.toHaveAttribute('href')
    expectSimpleRowText(screen, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(screen, 'signature-reward', '\uE9000.0001 XRP')
    expectSimpleRowText(screen, 'min-account-create-amount', '\uE9005.00 XRP')
  })
})
