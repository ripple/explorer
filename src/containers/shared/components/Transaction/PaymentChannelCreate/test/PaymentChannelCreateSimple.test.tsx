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
    expectSimpleRowLabel(wrapper, 'amount', 'Amount')
    expectSimpleRowText(wrapper, 'amount', '\uE9001.00 XRP')
    expectSimpleRowLabel(wrapper, 'source', 'source')
    expectSimpleRowText(
      wrapper,
      'source',
      'rJnQrhRTXutuSwtrwxYiTkHn4Dtp8sF2LM:2460331042',
    )
    expectSimpleRowLabel(wrapper, 'destination', 'destination')
    expectSimpleRowText(
      wrapper,
      'destination',
      'rUXYat4hW2M87gHoqKK7fC4cqrT9C6V7d7',
    )
    expectSimpleRowLabel(wrapper, 'delay', 'Settlement Delay')
    expectSimpleRowText(wrapper, 'delay', '3,600 sec.')
    expectSimpleRowLabel(wrapper, '.channel', 'Channel ID')
    expectSimpleRowText(
      wrapper,
      '.channel',
      '15AB9EE9344C42C05164E6A1F2F08B35F35D7B9D66CCB9697452B0995C8F8242',
    )
    wrapper.unmount()
  })

  it('renders failed tx', () => {
    renderComponent(mockPaymentChannelCreateFailed)
    expectSimpleRowText(wrapper, 'amount', '\uE90010.00 XRP')
    expectSimpleRowText(
      wrapper,
      'source',
      'rMphibGfHpLDU4DzVCspzLYVuMNpmzN6n8:2810223114',
    )
    expectSimpleRowText(
      wrapper,
      'destination',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expectSimpleRowText(wrapper, 'delay', '3,600 sec.')
    expectSimpleRowNotToExist(wrapper, '.channel')
    wrapper.unmount()
  })

  it('renders tx with destination tag', () => {
    renderComponent(mockPaymentChannelCreateWithDestinationTag)
    expectSimpleRowText(wrapper, 'amount', '\uE900100.00 XRP')
    expectSimpleRowText(wrapper, 'source', 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH')
    expectSimpleRowText(
      wrapper,
      'destination',
      'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428',
    )
    expectSimpleRowText(wrapper, 'delay', '86,400 sec.')
    expectSimpleRowText(
      wrapper,
      '.channel',
      '5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3',
    )
    wrapper.unmount()
  })
})
