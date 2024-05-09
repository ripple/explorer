import { useQuery } from 'react-query'
import { cleanup, screen } from '@testing-library/react'
import {
  createSimpleRenderFactory,
  expectSimpleRowLabel,
  expectSimpleRowText,
} from '../../test'
import { Simple } from '../Simple'
import mockPayment from './mock_data/Payment.json'
import mockPaymentConvert from './mock_data/PaymentWithConvert.json'
import mockPaymentDestinationTag from './mock_data/PaymentWithDestinationTag.json'
import mockPaymentPartial from './mock_data/PaymentWithPartial.json'
import mockPaymentSendMax from './mock_data/PaymentWithSendMax.json'
import mockPaymentSourceTag from './mock_data/PaymentWithSourceTag.json'
import mockPaymentMPT from './mock_data/PaymentMPT.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createSimpleRenderFactory(Simple)

describe('Payment: Simple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockPayment)

    expectSimpleRowText(screen, 'amount', `\uE9002,421.8268 XRP`)
    expectSimpleRowLabel(screen, 'amount', `send`)

    expectSimpleRowText(
      screen,
      'destination',
      `rHoPwMC75KVUhBMeV3uDMybKG5JND74teh`,
    )
  })

  it('renders with failed partial conversion', () => {
    renderComponent(mockPaymentConvert)

    expectSimpleRowLabel(screen, 'max', `convert_maximum`)
    expectSimpleRowText(screen, 'max', `\uE9001,140.00 XRP`)

    expectSimpleRowLabel(screen, 'amount', `convert_to`)
    expectSimpleRowText(
      screen,
      'amount',
      `0.00 YCN.r8HgVGenRTAiNSM5iqt9PX2D2EczFZhZrpartial_payment_allowed`,
    )

    expect(screen.find('[data-testid="destination"]')).not.toExist()
  })

  it('renders with destination tag', () => {
    renderComponent(mockPaymentDestinationTag)

    expectSimpleRowText(screen, 'amount', `\uE9001,531.267 XRP`)
    expectSimpleRowLabel(screen, 'amount', `send`)

    expectSimpleRowText(
      screen,
      'destination',
      `rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt:381702`,
    )
  })

  it('renders with send max', () => {
    renderComponent(mockPaymentSendMax)

    expectSimpleRowText(
      screen,
      'max',
      `17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA`,
    )
    expectSimpleRowLabel(screen, 'max', `using_at_most`)

    expectSimpleRowText(
      screen,
      'amount',
      `17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA`,
    )
    expectSimpleRowLabel(screen, 'amount', `send`)

    expectSimpleRowText(
      screen,
      'destination',
      `rprcTynT68nYdKzDTefAZG9HjSHiYcnP4b:0`,
    )
  })

  it('renders with partial', () => {
    renderComponent(mockPaymentPartial)

    expectSimpleRowText(
      screen,
      'amount',
      `0.00104196 xCoin.rXCoYSUnkpygdtfpz3Df8dKQuRZjM9UFipartial_payment_allowed`,
    )
    expectSimpleRowLabel(screen, 'amount', `delivered`)

    expectSimpleRowText(
      screen,
      'destination',
      `rMQ4oGC8fasuJwfdrfknFTttDbf8cR3D2j:0`,
    )
  })

  it('renders with SourceTag', () => {
    renderComponent(mockPaymentSourceTag)

    expectSimpleRowText(screen, 'source-tag', `20648`)
  })

  it('renders direct MPT payment', () => {
    const data = {
      assetScale: 3,
    }

    // @ts-ignore
    useQuery.mockImplementation(() => ({
      data,
    }))

    const wrapper = createWrapper(mockPaymentMPT)

    expectSimpleRowText(
      wrapper,
      'amount',
      `0.1 MPT (000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F)`,
    )
    expectSimpleRowLabel(wrapper, 'amount', `send`)

    expectSimpleRowText(
      wrapper,
      'destination',
      `rw6UtpfBFaGht6SiC1HpDPNw6Yt25pKvnu`,
    )

    wrapper.unmount()
  })
})
