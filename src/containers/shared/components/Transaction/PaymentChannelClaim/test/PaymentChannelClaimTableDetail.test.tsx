import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'

import { createTableDetailRenderFactory } from '../../test/createRenderFactory'
import { TableDetail } from '../TableDetail'
import mockPaymentChannelClaim from './mock_data/PaymentChannelClaim.json'
import mockPaymentChannelClaimClosed from './mock_data/PaymentChannelClaimClosed.json'
import mockPaymentChannelClaimCloseDenied from './mock_data/PaymentChannelClaimCloseDenied.json'
import mockPaymentChannelClaimWithDestinationTag from './mock_data/PaymentChannelClaimWithDestinationTag.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('PaymentChannelClaim: TableDetail', () => {
  afterEach(cleanup)
  it('renders a claim', () => {
    renderComponent(mockPaymentChannelClaim)
    expect(screen.getByTestId('source')).toHaveTextContent(
      'sourcernNzy3iPc7gPEAJbAdXwxY1UTBamBqTYhR:1002539517',
    )
    expect(screen.getByTestId('destination')).toHaveTextContent(
      'destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expect(screen.getByTestId('claimed')).toHaveTextContent(
      'claimed\uE9000.01 XRP (\uE90020.34284 XRP of \uE90070.00 XRP remaining)',
    )
    expect(screen.getByTestId('channel-amount')).not.toExist()
    expect(screen.getByTestId('renew')).not.toExist()
    expect(screen.getByTestId('close-request')).not.toExist()
    expect(screen.getByTestId('closed')).not.toExist()
  })

  it('renders tx with channel being closed', () => {
    renderComponent(mockPaymentChannelClaimClosed)
    expect(screen.getByTestId('source')).toHaveTextContent(
      'sourcerH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expect(screen.getByTestId('destination')).toHaveTextContent(
      'destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expect(screen.getByTestId('claimed')).not.toExist()
    expect(screen.getByTestId('channel-amount')).toHaveTextContent(
      'channel amount\uE90010.00 XRP',
    )
    expect(screen.getByTestId('renew')).not.toExist()
    expect(screen.getByTestId('close-request')).toHaveTextContent(
      'close channel request',
    )
    expect(screen.getByTestId('closed')).toHaveTextContent(
      'payment channel closed',
    )
  })

  it('renders tx requesting channel be closed but not closing it', () => {
    renderComponent(mockPaymentChannelClaimCloseDenied)
    expect(screen.getByTestId('source')).toHaveTextContent(
      'sourcerH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expect(screen.getByTestId('destination')).toHaveTextContent(
      'destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expect(screen.getByTestId('claimed')).not.toExist()
    expect(screen.getByTestId('channel-amount')).toHaveTextContent(
      'channel amount\uE90010.00 XRP',
    )
    expect(screen.getByTestId('renew')).not.toExist()
    expect(screen.getByTestId('close-request')).toHaveTextContent(
      'close channel request',
    )
    expect(screen.getByTestId('closed')).not.toExist()
  })

  it('renders tx with destination tag', () => {
    renderComponent(mockPaymentChannelClaimWithDestinationTag)
    expect(screen.getByTestId('source')).toHaveTextContent(
      'sourcerN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    )
    expect(screen.getByTestId('destination')).toHaveTextContent(
      'destinationrf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428',
    )
    expect(screen.getByTestId('claimed')).toHaveTextContent(
      'claimed\uE9001.00 XRP (\uE90099.00 XRP of \uE900100.00 XRP remaining)',
    )
    expect(screen.getByTestId('channel-amount')).not.toExist()
    expect(screen.getByTestId('renew')).not.toExist()
    expect(screen.getByTestId('close-request')).not.toExist()
    expect(screen.getByTestId('closed')).not.toExist()
  })
})
