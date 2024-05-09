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
    expect(wrapper.find('[data-testid="source"]')).toHaveText(
      'sourcernNzy3iPc7gPEAJbAdXwxY1UTBamBqTYhR:1002539517',
    )
    expect(wrapper.find('[data-testid="destination"]')).toHaveText(
      'destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expect(wrapper.find('[data-testid="claimed"]')).toHaveText(
      'claimed\uE9000.01 XRP (\uE90020.34284 XRP of \uE90070.00 XRP remaining)',
    )
    expect(wrapper.find('[data-testid="channel-amount"]')).not.toExist()
    expect(wrapper.find('[data-testid="renew"]')).not.toExist()
    expect(wrapper.find('[data-testid="close-request"]')).not.toExist()
    expect(wrapper.find('[data-testid="closed"]')).not.toExist()
    wrapper.unmount()
  })

  it('renders tx with channel being closed', () => {
    renderComponent(mockPaymentChannelClaimClosed)
    expect(wrapper.find('[data-testid="source"]')).toHaveText(
      'sourcerH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expect(wrapper.find('[data-testid="destination"]')).toHaveText(
      'destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expect(wrapper.find('[data-testid="claimed"]')).not.toExist()
    expect(wrapper.find('[data-testid="channel-amount"]')).toHaveText(
      'channel amount\uE90010.00 XRP',
    )
    expect(wrapper.find('[data-testid="renew"]')).not.toExist()
    expect(wrapper.find('[data-testid="close-request"]')).toHaveText(
      'close channel request',
    )
    expect(wrapper.find('[data-testid="closed"]')).toHaveText(
      'payment channel closed',
    )
    wrapper.unmount()
  })

  it('renders tx requesting channel be closed but not closing it', () => {
    renderComponent(mockPaymentChannelClaimCloseDenied)
    expect(wrapper.find('[data-testid="source"]')).toHaveText(
      'sourcerH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expect(wrapper.find('[data-testid="destination"]')).toHaveText(
      'destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expect(wrapper.find('[data-testid="claimed"]')).not.toExist()
    expect(wrapper.find('[data-testid="channel-amount"]')).toHaveText(
      'channel amount\uE90010.00 XRP',
    )
    expect(wrapper.find('[data-testid="renew"]')).not.toExist()
    expect(wrapper.find('[data-testid="close-request"]')).toHaveText(
      'close channel request',
    )
    expect(wrapper.find('[data-testid="closed"]')).not.toExist()
    wrapper.unmount()
  })

  it('renders tx with destination tag', () => {
    renderComponent(mockPaymentChannelClaimWithDestinationTag)
    expect(wrapper.find('[data-testid="source"]')).toHaveText(
      'sourcerN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    )
    expect(wrapper.find('[data-testid="destination"]')).toHaveText(
      'destinationrf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428',
    )
    expect(wrapper.find('[data-testid="claimed"]')).toHaveText(
      'claimed\uE9001.00 XRP (\uE90099.00 XRP of \uE900100.00 XRP remaining)',
    )
    expect(wrapper.find('[data-testid="channel-amount"]')).not.toExist()
    expect(wrapper.find('[data-testid="renew"]')).not.toExist()
    expect(wrapper.find('[data-testid="close-request"]')).not.toExist()
    expect(wrapper.find('[data-testid="closed"]')).not.toExist()
    wrapper.unmount()
  })
})
