import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockPaymentChannelFund from './mock_data/PaymentChannelFund.json'
import mockPaymentChannelFundFailed from './mock_data/PaymentChannelFundFailed.json'
import {
  expectSimpleRowLabel,
  expectSimpleRowNotToExist,
  expectSimpleRowText,
} from '../../test'

const createWrapper = createSimpleWrapperFactory(Simple, i18n)

describe('PaymentChannelFund: Simple', () => {
  it('renders a fund', () => {
    const wrapper = createWrapper(mockPaymentChannelFund)
    expectSimpleRowLabel(wrapper, 'increase', 'channel amount increase')
    expectSimpleRowText(wrapper, 'increase', '+\uE9001.00 XRP')
    expectSimpleRowLabel(wrapper, 'channel-amount', 'channel amount')
    expectSimpleRowText(wrapper, 'channel-amount', '\uE90075.00 XRP')
    expectSimpleRowLabel(wrapper, 'total', 'total claimed')
    expectSimpleRowText(wrapper, 'total', '\uE90061.859345 XRP')
    expectSimpleRowLabel(wrapper, 'source', 'source')
    expectSimpleRowText(
      wrapper,
      'source',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN:3839231768',
    )
    expectSimpleRowLabel(wrapper, 'destination', 'destination')
    expectSimpleRowText(
      wrapper,
      'destination',
      'rBFpf3YQQrcR1HnCt5AhYpNVvXUh4W89Dr',
    )
    expectSimpleRowLabel(wrapper, '.channel', 'Channel ID')
    expectSimpleRowText(
      wrapper,
      '.channel',
      '4BEAC9E4C10674AB698EAC0F2D78A4FF507428370578A59B04883E7EB8D82260',
    )
    wrapper.unmount()
  })

  it('renders failed tx', () => {
    const wrapper = createWrapper(mockPaymentChannelFundFailed)
    expectSimpleRowLabel(wrapper, 'increase', 'channel amount increase')
    expectSimpleRowText(wrapper, 'increase', '+\uE90020.00 XRP')
    expectSimpleRowNotToExist(wrapper, 'channel-amount')
    expectSimpleRowNotToExist(wrapper, 'total')
    expectSimpleRowNotToExist(wrapper, 'source')
    expectSimpleRowNotToExist(wrapper, 'destination')
    expectSimpleRowNotToExist(wrapper, 'source')
    expectSimpleRowText(
      wrapper,
      '.channel',
      '933F93F7113A2F94B7838D64D0D2A244C57EFD6411C16FFF5FA293D200EF5876',
    )
    wrapper.unmount()
  })
})
