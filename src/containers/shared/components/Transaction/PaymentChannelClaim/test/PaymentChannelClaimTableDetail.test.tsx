import i18n from '../../../../../../i18nTestConfig.en-US'

import { createTableDetailWrapperFactory } from '../../test/createWrapperFactory'
import { TableDetail } from '../TableDetail'
import mockPaymentChannelClaim from './mock_data/PaymentChannelClaim.json'
import mockPaymentChannelClaimClosed from './mock_data/PaymentChannelClaimClosed.json'
import mockPaymentChannelClaimCloseDenied from './mock_data/PaymentChannelClaimCloseDenied.json'
import mockPaymentChannelClaimWithDestinationTag from './mock_data/PaymentChannelClaimWithDestinationTag.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('PaymentChannelClaim: TableDetail', () => {
  it('renders a claim', () => {
    const wrapper = createWrapper(mockPaymentChannelClaim)
    expect(wrapper.find('[data-test="source"]')).toHaveText(
      'sourcernNzy3iPc7gPEAJbAdXwxY1UTBamBqTYhR:1002539517',
    )
    expect(wrapper.find('[data-test="destination"]')).toHaveText(
      'destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expect(wrapper.find('[data-test="claimed"]')).toHaveText(
      'claimed\uE9000.01 XRP (\uE90020.34284 XRP of \uE90070.00 XRP remaining)',
    )
    expect(wrapper.find('[data-test="amount"]')).not.toExist()
    expect(wrapper.find('[data-test="renew"]')).not.toExist()
    expect(wrapper.find('[data-test="close-request"]')).not.toExist()
    expect(wrapper.find('[data-test="closed"]')).not.toExist()
    wrapper.unmount()
  })

  it('renders tx with channel being closed', () => {
    const wrapper = createWrapper(mockPaymentChannelClaimClosed)
    expect(wrapper.find('[data-test="source"]')).toHaveText(
      'sourcerH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expect(wrapper.find('[data-test="destination"]')).toHaveText(
      'destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expect(wrapper.find('[data-test="claimed"]')).not.toExist()
    expect(wrapper.find('[data-test="amount"]')).toHaveText(
      'channel amount\uE90010.00 XRP',
    )
    expect(wrapper.find('[data-test="renew"]')).not.toExist()
    expect(wrapper.find('[data-test="close-request"]')).toHaveText(
      'close channel request',
    )
    expect(wrapper.find('[data-test="closed"]')).toHaveText(
      'payment channel closed',
    )
    wrapper.unmount()
  })

  it('renders tx requesting channel be closed but not closing it', () => {
    const wrapper = createWrapper(mockPaymentChannelClaimCloseDenied)
    expect(wrapper.find('[data-test="source"]')).toHaveText(
      'sourcerH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expect(wrapper.find('[data-test="destination"]')).toHaveText(
      'destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expect(wrapper.find('[data-test="claimed"]')).not.toExist()
    expect(wrapper.find('[data-test="amount"]')).toHaveText(
      'channel amount\uE90010.00 XRP',
    )
    expect(wrapper.find('[data-test="renew"]')).not.toExist()
    expect(wrapper.find('[data-test="close-request"]')).toHaveText(
      'close channel request',
    )
    expect(wrapper.find('[data-test="closed"]')).not.toExist()
    wrapper.unmount()
  })

  it('renders tx with destination tag', () => {
    const wrapper = createWrapper(mockPaymentChannelClaimWithDestinationTag)
    expect(wrapper.find('[data-test="source"]')).toHaveText(
      'sourcerN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    )
    expect(wrapper.find('[data-test="destination"]')).toHaveText(
      'destinationrf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428',
    )
    expect(wrapper.find('[data-test="claimed"]')).toHaveText(
      'claimed\uE9001.00 XRP (\uE90099.00 XRP of \uE900100.00 XRP remaining)',
    )
    expect(wrapper.find('[data-test="amount"]')).not.toExist()
    expect(wrapper.find('[data-test="renew"]')).not.toExist()
    expect(wrapper.find('[data-test="close-request"]')).not.toExist()
    expect(wrapper.find('[data-test="closed"]')).not.toExist()
    wrapper.unmount()
  })
})
