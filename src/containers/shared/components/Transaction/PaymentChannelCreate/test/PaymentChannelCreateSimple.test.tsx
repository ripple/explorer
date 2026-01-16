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
  it('renders', () => {
    const { container, unmount } = renderComponent(mockPaymentChannelCreate)
    expectSimpleRowLabel(container, 'amount', 'Amount')
    expectSimpleRowText(container, 'amount', '\uE9001.00 XRP')
    expectSimpleRowLabel(container, 'source', 'source')
    expectSimpleRowText(
      container,
      'source',
      'rJnQrhRTXutuSwtrwxYiTkHn4Dtp8sF2LM:2460331042',
    )
    expectSimpleRowLabel(container, 'destination', 'destination')
    expectSimpleRowText(
      container,
      'destination',
      'rUXYat4hW2M87gHoqKK7fC4cqrT9C6V7d7',
    )
    expectSimpleRowLabel(container, 'delay', 'Settlement Delay')
    expectSimpleRowText(container, 'delay', '3,600 sec.')
    expectSimpleRowLabel(container, '.channel', 'Channel ID')
    expectSimpleRowText(
      container,
      '.channel',
      '15AB9EE9344C42C05164E6A1F2F08B35F35D7B9D66CCB9697452B0995C8F8242',
    )
    unmount()
  })

  it('renders failed tx', () => {
    const { container, unmount } = renderComponent(mockPaymentChannelCreateFailed)
    expectSimpleRowText(container, 'amount', '\uE90010.00 XRP')
    expectSimpleRowText(
      container,
      'source',
      'rMphibGfHpLDU4DzVCspzLYVuMNpmzN6n8:2810223114',
    )
    expectSimpleRowText(
      container,
      'destination',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expectSimpleRowText(container, 'delay', '3,600 sec.')
    expectSimpleRowNotToExist(container, '.channel')
    unmount()
  })

  it('renders tx with destination tag', () => {
    const { container, unmount } = renderComponent(mockPaymentChannelCreateWithDestinationTag)
    expectSimpleRowText(container, 'amount', '\uE900100.00 XRP')
    expectSimpleRowText(container, 'source', 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH')
    expectSimpleRowText(
      container,
      'destination',
      'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428',
    )
    expectSimpleRowText(container, 'delay', '86,400 sec.')
    expectSimpleRowText(
      container,
      '.channel',
      '5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3',
    )
    unmount()
  })
})
