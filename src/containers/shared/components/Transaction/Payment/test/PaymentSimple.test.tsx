import { useQuery } from 'react-query'
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
import mockPermDomainID from './mock_data/PaymentWithPermDomainID.json'
import mockPaymentWithCredentialIDs from './mock_data/PaymentWithCredentialIDs.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createSimpleRenderFactory(Simple)

describe('Payment: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockPayment)

    expectSimpleRowText(container, 'amount', `\uE9002,421.8268 XRP`)
    expectSimpleRowLabel(container, 'amount', `send`)

    expectSimpleRowText(
      container,
      'destination',
      `rHoPwMC75KVUhBMeV3uDMybKG5JND74teh`,
    )

    unmount()
  })

  it('renders with failed partial conversion', () => {
    const { container, unmount } = renderComponent(mockPaymentConvert)

    expectSimpleRowLabel(container, 'max', `convert_maximum`)
    expectSimpleRowText(container, 'max', `\uE9001,140.00 XRP`)

    expectSimpleRowLabel(container, 'amount', `convert_to`)
    expectSimpleRowText(
      container,
      'amount',
      `0.00 YCN.r8HgVGenRTAiNSM5iqt9PX2D2EczFZhZrpartial_payment_allowed`,
    )

    expect(container.querySelector('[data-testid="destination"]')).not.toBeInTheDocument()

    unmount()
  })

  it('renders with destination tag', () => {
    const { container, unmount } = renderComponent(mockPaymentDestinationTag)

    expectSimpleRowText(container, 'amount', `\uE9001,531.267 XRP`)
    expectSimpleRowLabel(container, 'amount', `send`)

    expectSimpleRowText(
      container,
      'destination',
      `rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt:381702`,
    )

    unmount()
  })

  it('renders with send max', () => {
    const { container, unmount } = renderComponent(mockPaymentSendMax)

    expectSimpleRowText(
      container,
      'max',
      `17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA`,
    )
    expectSimpleRowLabel(container, 'max', `using_at_most`)

    expectSimpleRowText(
      container,
      'amount',
      `17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA`,
    )
    expectSimpleRowLabel(container, 'amount', `send`)

    expectSimpleRowText(
      container,
      'destination',
      `rprcTynT68nYdKzDTefAZG9HjSHiYcnP4b:0`,
    )

    unmount()
  })

  it('renders with partial', () => {
    const { container, unmount } = renderComponent(mockPaymentPartial)

    expectSimpleRowText(
      container,
      'amount',
      `0.00104196 xCoin.rXCoYSUnkpygdtfpz3Df8dKQuRZjM9UFipartial_payment_allowed`,
    )
    expectSimpleRowLabel(container, 'amount', `delivered`)

    expectSimpleRowText(
      container,
      'destination',
      `rMQ4oGC8fasuJwfdrfknFTttDbf8cR3D2j:0`,
    )

    unmount()
  })

  it('renders with SourceTag', () => {
    const { container, unmount } = renderComponent(mockPaymentSourceTag)

    expectSimpleRowText(container, 'source-tag', `20648`)

    unmount()
  })

  it('renders direct MPT payment', () => {
    const data = {
      assetScale: 3,
    }

    // @ts-ignore
    useQuery.mockImplementation(() => ({
      data,
    }))

    const { container, unmount } = renderComponent(mockPaymentMPT)

    expectSimpleRowText(
      container,
      'amount',
      `0.1 MPT (000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F)`,
    )
    expectSimpleRowLabel(container, 'amount', `send`)

    expectSimpleRowText(
      container,
      'destination',
      `rw6UtpfBFaGht6SiC1HpDPNw6Yt25pKvnu`,
    )

    unmount()
  })

  it(`renders with Permissioned Domain ID`, () => {
    const { container, unmount } = renderComponent(mockPermDomainID)

    expectSimpleRowText(
      container,
      'domain-id',
      `D3261DF48CDA3B860ED3FA99F02138856393CD44556E028D5CB66192A18A8D02`,
    )
    expectSimpleRowLabel(container, 'domain-id', `domain_id`)

    unmount()
  })

  it('renders with CredentialIDs', () => {
    const { container, unmount } = renderComponent(mockPaymentWithCredentialIDs)

    expectSimpleRowText(container, 'amount', `\uE9002,421.8268 XRP`)
    expectSimpleRowLabel(container, 'amount', `send`)

    expectSimpleRowText(
      container,
      'destination',
      `rHoPwMC75KVUhBMeV3uDMybKG5JND74teh`,
    )

    // Check credential IDs as individual rows
    expectSimpleRowText(
      container,
      'credential-id-0',
      '7B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A955',
    )
    expectSimpleRowLabel(container, 'credential-id-0', 'credential_ids')
    expectSimpleRowText(
      container,
      'credential-id-1',
      '8B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A956',
    )
    expectSimpleRowLabel(container, 'credential-id-1', '')

    unmount()
  })
})
