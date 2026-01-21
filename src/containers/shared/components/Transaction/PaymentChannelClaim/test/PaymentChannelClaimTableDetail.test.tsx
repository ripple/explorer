import i18n from '../../../../../../i18n/testConfigEnglish'

import { createTableDetailRenderFactory } from '../../test/createWrapperFactory'
import { TableDetail } from '../TableDetail'
import mockPaymentChannelClaim from './mock_data/PaymentChannelClaim.json'
import mockPaymentChannelClaimClosed from './mock_data/PaymentChannelClaimClosed.json'
import mockPaymentChannelClaimCloseDenied from './mock_data/PaymentChannelClaimCloseDenied.json'
import mockPaymentChannelClaimWithDestinationTag from './mock_data/PaymentChannelClaimWithDestinationTag.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('PaymentChannelClaim: TableDetail', () => {
  it('renders a claim', () => {
    const { container, unmount } = renderComponent(mockPaymentChannelClaim)
    expect(container.querySelector('[data-testid="source"]')).toHaveTextContent(
      'sourcernNzy3iPc7gPEAJbAdXwxY1UTBamBqTYhR:1002539517',
    )
    expect(
      container.querySelector('[data-testid="destination"]'),
    ).toHaveTextContent('destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN')
    expect(
      container.querySelector('[data-testid="claimed"]'),
    ).toHaveTextContent(
      'claimed\uE9000.01 XRP (\uE90020.34284 XRP of \uE90070.00 XRP remaining)',
    )
    expect(
      container.querySelector('[data-testid="channel-amount"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="renew"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="close-request"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="closed"]'),
    ).not.toBeInTheDocument()
    unmount()
  })

  it('renders tx with channel being closed', () => {
    const { container, unmount } = renderComponent(
      mockPaymentChannelClaimClosed,
    )
    expect(container.querySelector('[data-testid="source"]')).toHaveTextContent(
      'sourcerH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expect(
      container.querySelector('[data-testid="destination"]'),
    ).toHaveTextContent('destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN')
    expect(
      container.querySelector('[data-testid="claimed"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="channel-amount"]'),
    ).toHaveTextContent('channel amount\uE90010.00 XRP')
    expect(
      container.querySelector('[data-testid="renew"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="close-request"]'),
    ).toHaveTextContent('close channel request')
    expect(container.querySelector('[data-testid="closed"]')).toHaveTextContent(
      'payment channel closed',
    )
    unmount()
  })

  it('renders tx requesting channel be closed but not closing it', () => {
    const { container, unmount } = renderComponent(
      mockPaymentChannelClaimCloseDenied,
    )
    expect(container.querySelector('[data-testid="source"]')).toHaveTextContent(
      'sourcerH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expect(
      container.querySelector('[data-testid="destination"]'),
    ).toHaveTextContent('destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN')
    expect(
      container.querySelector('[data-testid="claimed"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="channel-amount"]'),
    ).toHaveTextContent('channel amount\uE90010.00 XRP')
    expect(
      container.querySelector('[data-testid="renew"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="close-request"]'),
    ).toHaveTextContent('close channel request')
    expect(
      container.querySelector('[data-testid="closed"]'),
    ).not.toBeInTheDocument()
    unmount()
  })

  it('renders tx with destination tag', () => {
    const { container, unmount } = renderComponent(
      mockPaymentChannelClaimWithDestinationTag,
    )
    expect(container.querySelector('[data-testid="source"]')).toHaveTextContent(
      'sourcerN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    )
    expect(
      container.querySelector('[data-testid="destination"]'),
    ).toHaveTextContent(
      'destinationrf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428',
    )
    expect(
      container.querySelector('[data-testid="claimed"]'),
    ).toHaveTextContent(
      'claimed\uE9001.00 XRP (\uE90099.00 XRP of \uE900100.00 XRP remaining)',
    )
    expect(
      container.querySelector('[data-testid="channel-amount"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="renew"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="close-request"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="closed"]'),
    ).not.toBeInTheDocument()
    unmount()
  })
})
