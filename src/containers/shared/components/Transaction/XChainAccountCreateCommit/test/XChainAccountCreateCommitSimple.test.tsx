import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockXChainAccountCreateCommit from './mock_data/XChainAccountCreateCommit.json'
import mockXChainAccountCreateCommitInsufficientFunds from './mock_data/XChainAccountCreateCommitInsufficientFunds.json'
import { expectSimpleRowText } from '../../test/expectations'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainAccountCreateCommitSimple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockXChainAccountCreateCommit)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(
      screen.getByText('rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR'),
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

    expectSimpleRowText(screen, 'send', '\uE90010.00 XRP')
    expectSimpleRowText(
      screen,
      'destination',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expect(
      screen.getByText('raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym'),
    ).not.toHaveAttribute('href')
  })

  it('renders failed transaction', () => {
    renderComponent(mockXChainAccountCreateCommitInsufficientFunds)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(
      screen.getByText('raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym'),
    ).not.toHaveAttribute('href')
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

    expectSimpleRowText(screen, 'send', '\uE9001,000.00 XRP')
    expectSimpleRowText(
      screen,
      'destination',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expect(
      screen.getByText('raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym'),
    ).not.toHaveAttribute('href')
  })
})
