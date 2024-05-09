import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockPayment from './mock_data/Payment.json'
import mockPaymentConvert from './mock_data/PaymentWithConvert.json'
import mockPaymentDestinationTag from './mock_data/PaymentWithDestinationTag.json'
import mockPaymentPartial from './mock_data/PaymentWithPartial.json'
import mockPaymentSendMax from './mock_data/PaymentWithSendMax.json'
import mockPaymentSourceTag from './mock_data/PaymentWithSourceTag.json'

const createWrapper = createTableDetailRenderFactory(TableDetail)

describe('Payment: TableDetail', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockPayment)

    // styling makes this look okay
    expect(wrapper.find('.payment')).toHaveText(
      `send\uE9002,421.8268 XRPtorHoPwMC75KVUhBMeV3uDMybKG5JND74teh`,
    )

    wrapper.unmount()
  })

  it('renders with failed partial conversion', () => {
    const wrapper = createWrapper(mockPaymentConvert)

    // styling makes this look okay
    expect(wrapper.find('.payment')).toHaveText(
      `convert_maximum1,140.00 XRPto0.00 YCN.r8HgVGenRTAiNSM5iqt9PX2D2EczFZhZrpartial_payment_allowed`,
    )

    wrapper.unmount()
  })

  it('renders with destination tag', () => {
    const wrapper = createWrapper(mockPaymentDestinationTag)

    // styling makes this look okay
    expect(wrapper.find('.payment')).toHaveText(
      `send1,531.267 XRPtorHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt:381702`,
    )

    wrapper.unmount()
  })

  it('renders with send max', () => {
    const wrapper = createWrapper(mockPaymentSendMax)

    // styling makes this look okay
    expect(wrapper.find('.payment')).toHaveText(
      `send17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjAtorprcTynT68nYdKzDTefAZG9HjSHiYcnP4b:0`,
    )

    wrapper.unmount()
  })

  it('renders with partial', () => {
    const wrapper = createWrapper(mockPaymentPartial)

    // styling makes this look okay
    expect(wrapper.find('.payment')).toHaveText(
      `send0.00104196 xCoin.rXCoYSUnkpygdtfpz3Df8dKQuRZjM9UFitorMQ4oGC8fasuJwfdrfknFTttDbf8cR3D2j:0partial_payment_allowed`,
    )

    wrapper.unmount()
  })

  it('renders with SourceTag', () => {
    const wrapper = createWrapper(mockPaymentSourceTag)

    expect(wrapper.find('.st')).toHaveText('source_tag: 20648')

    wrapper.unmount()
  })
})
