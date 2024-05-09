import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createRenderFactory'
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
  afterEach(cleanup)
  it('renders a fund', () => {
    renderComponent(mockPaymentChannelFund)
    expectSimpleRowLabel(screen, 'increase', 'channel amount increase')
    expectSimpleRowText(screen, 'increase', '+\uE9001.00 XRP')
    expectSimpleRowLabel(screen, 'channel-amount', 'channel amount')
    expectSimpleRowText(screen, 'channel-amount', '\uE90075.00 XRP')
    expectSimpleRowLabel(screen, 'total', 'total claimed')
    expectSimpleRowText(screen, 'total', '\uE90061.859345 XRP')
    expectSimpleRowLabel(screen, 'source', 'source')
    expectSimpleRowText(
      screen,
      'source',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN:3839231768',
    )
    expectSimpleRowLabel(screen, 'destination', 'destination')
    expectSimpleRowText(
      screen,
      'destination',
      'rBFpf3YQQrcR1HnCt5AhYpNVvXUh4W89Dr',
    )
    expectSimpleRowLabel(screen, 'channel', 'Channel ID')
    expectSimpleRowText(
      screen,
      'channel',
      '4BEAC9E4C10674AB698EAC0F2D78A4FF507428370578A59B04883E7EB8D82260',
    )
  })

  it('renders failed tx', () => {
    renderComponent(mockPaymentChannelFundFailed)
    expectSimpleRowLabel(screen, 'increase', 'channel amount increase')
    expectSimpleRowText(screen, 'increase', '+\uE90020.00 XRP')
    expectSimpleRowNotToExist(screen, 'channel-amount')
    expectSimpleRowNotToExist(screen, 'total')
    expectSimpleRowNotToExist(screen, 'source')
    expectSimpleRowNotToExist(screen, 'destination')
    expectSimpleRowNotToExist(screen, 'source')
    expectSimpleRowText(
      screen,
      'channel',
      '933F93F7113A2F94B7838D64D0D2A244C57EFD6411C16FFF5FA293D200EF5876',
    )
  })
})
