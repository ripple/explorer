import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'

import {
  createSimpleRenderFactory,
  expectSimpleRowLabel,
  expectSimpleRowNotToExist,
  expectSimpleRowText,
} from '../../test'
import mockPaymentChannelCreate from './mock_data/PaymentChannelCreate.json'
import mockPaymentChannelCreateFailed from './mock_data/PaymentChannelCreateFailed.json'
import mockPaymentChannelCreateWithDestinationTag from './mock_data/PaymentChannelCreateWithDestinationTag.json'
import { Simple } from '../Simple'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('PaymentChannelCreate: Simple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockPaymentChannelCreate)
    expectSimpleRowLabel(screen, 'amount', 'Amount')
    expectSimpleRowText(screen, 'amount', '\uE9001.00 XRP')
    expectSimpleRowLabel(screen, 'source', 'source')
    expectSimpleRowText(
      screen,
      'source',
      'rJnQrhRTXutuSwtrwxYiTkHn4Dtp8sF2LM:2460331042',
    )
    expectSimpleRowLabel(screen, 'destination', 'destination')
    expectSimpleRowText(
      screen,
      'destination',
      'rUXYat4hW2M87gHoqKK7fC4cqrT9C6V7d7',
    )
    expectSimpleRowLabel(screen, 'delay', 'Settlement Delay')
    expectSimpleRowText(screen, 'delay', '3,600 sec.')
    expectSimpleRowLabel(screen, '.channel', 'Channel ID')
    expectSimpleRowText(
      screen,
      '.channel',
      '15AB9EE9344C42C05164E6A1F2F08B35F35D7B9D66CCB9697452B0995C8F8242',
    )
  })

  it('renders failed tx', () => {
    renderComponent(mockPaymentChannelCreateFailed)
    expectSimpleRowText(screen, 'amount', '\uE90010.00 XRP')
    expectSimpleRowText(
      screen,
      'source',
      'rMphibGfHpLDU4DzVCspzLYVuMNpmzN6n8:2810223114',
    )
    expectSimpleRowText(
      screen,
      'destination',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expectSimpleRowText(screen, 'delay', '3,600 sec.')
    expectSimpleRowNotToExist(screen, '.channel')
  })

  it('renders tx with destination tag', () => {
    renderComponent(mockPaymentChannelCreateWithDestinationTag)
    expectSimpleRowText(screen, 'amount', '\uE900100.00 XRP')
    expectSimpleRowText(screen, 'source', 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH')
    expectSimpleRowText(
      screen,
      'destination',
      'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428',
    )
    expectSimpleRowText(screen, 'delay', '86,400 sec.')
    expectSimpleRowText(
      screen,
      '.channel',
      '5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3',
    )
  })
})
