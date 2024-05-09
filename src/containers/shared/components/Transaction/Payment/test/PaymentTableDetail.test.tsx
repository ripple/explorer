import { cleanup, screen } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockPayment from './mock_data/Payment.json'
import mockPaymentConvert from './mock_data/PaymentWithConvert.json'
import mockPaymentDestinationTag from './mock_data/PaymentWithDestinationTag.json'
import mockPaymentPartial from './mock_data/PaymentWithPartial.json'
import mockPaymentSendMax from './mock_data/PaymentWithSendMax.json'
import mockPaymentSourceTag from './mock_data/PaymentWithSourceTag.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('Payment: TableDetail', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockPayment)

    // styling makes this look okay
    expect(wrapper.find('.payment')).toHaveText(
      `send\uE9002,421.8268 XRPtorHoPwMC75KVUhBMeV3uDMybKG5JND74teh`,
    )
  })

  it('renders with failed partial conversion', () => {
    renderComponent(mockPaymentConvert)

    // styling makes this look okay
    expect(wrapper.find('.payment')).toHaveText(
      `convert_maximum1,140.00 XRPto0.00 YCN.r8HgVGenRTAiNSM5iqt9PX2D2EczFZhZrpartial_payment_allowed`,
    )
  })

  it('renders with destination tag', () => {
    renderComponent(mockPaymentDestinationTag)

    // styling makes this look okay
    expect(wrapper.find('.payment')).toHaveText(
      `send1,531.267 XRPtorHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt:381702`,
    )
  })

  it('renders with send max', () => {
    renderComponent(mockPaymentSendMax)

    // styling makes this look okay
    expect(wrapper.find('.payment')).toHaveText(
      `send17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjAtorprcTynT68nYdKzDTefAZG9HjSHiYcnP4b:0`,
    )
  })

  it('renders with partial', () => {
    renderComponent(mockPaymentPartial)

    // styling makes this look okay
    expect(wrapper.find('.payment')).toHaveText(
      `send0.00104196 xCoin.rXCoYSUnkpygdtfpz3Df8dKQuRZjM9UFitorMQ4oGC8fasuJwfdrfknFTttDbf8cR3D2j:0partial_payment_allowed`,
    )
  })

  it('renders with SourceTag', () => {
    renderComponent(mockPaymentSourceTag)

    expect(wrapper.find('.st')).toHaveText('source_tag: 20648')
  })
})
