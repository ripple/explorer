import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockPaymentChannelFund from './mock_data/PaymentChannelFund.json'
import mockPaymentChannelFundFailed from './mock_data/PaymentChannelFundFailed.json'
import {
  expectSimpleRowLabel,
  expectSimpleRowNotToExist,
  expectSimpleRowText,
} from '../../test'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('PaymentChannelFund: Simple', () => {
  it('renders a fund', () => {
    const { container, unmount } = renderComponent(mockPaymentChannelFund)
    expectSimpleRowLabel(container, 'increase', 'channel amount increase')
    expectSimpleRowText(container, 'increase', '+\uE9001.00 XRP')
    expectSimpleRowLabel(container, 'channel-amount', 'channel amount')
    expectSimpleRowText(container, 'channel-amount', '\uE90075.00 XRP')
    expectSimpleRowLabel(container, 'total', 'total claimed')
    expectSimpleRowText(container, 'total', '\uE90061.859345 XRP')
    expectSimpleRowLabel(container, 'source', 'source')
    expectSimpleRowText(
      container,
      'source',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN:3839231768',
    )
    expectSimpleRowLabel(container, 'destination', 'destination')
    expectSimpleRowText(
      container,
      'destination',
      'rBFpf3YQQrcR1HnCt5AhYpNVvXUh4W89Dr',
    )
    expectSimpleRowLabel(container, '.channel', 'Channel ID')
    expectSimpleRowText(
      container,
      '.channel',
      '4BEAC9E4C10674AB698EAC0F2D78A4FF507428370578A59B04883E7EB8D82260',
    )
    unmount()
  })

  it('renders failed tx', () => {
    const { container, unmount } = renderComponent(mockPaymentChannelFundFailed)
    expectSimpleRowLabel(container, 'increase', 'channel amount increase')
    expectSimpleRowText(container, 'increase', '+\uE90020.00 XRP')
    expectSimpleRowNotToExist(container, 'channel-amount')
    expectSimpleRowNotToExist(container, 'total')
    expectSimpleRowNotToExist(container, 'source')
    expectSimpleRowNotToExist(container, 'destination')
    expectSimpleRowNotToExist(container, 'source')
    expectSimpleRowText(
      container,
      '.channel',
      '933F93F7113A2F94B7838D64D0D2A244C57EFD6411C16FFF5FA293D200EF5876',
    )
    unmount()
  })
})
