import { useQuery } from 'react-query'
import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockEscrowFinish from './mock_data/EscrowFinish.json'
import mockEscrowFinishCompAllow from './mock_data/EscrowFinishComputationAllowance.json'
import mockEscrowFinishCredentialIDs from './mock_data/EscrowFinishWithCredentialIDs.json'

const renderComponent = createSimpleRenderFactory(Simple)

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

function getTestByName(name: string) {
  return mockEscrowFinish[name]
}

describe('EscrowFinishSimple', () => {
  it('renders with an expiration and offer', () => {
    const { container, unmount } = renderComponent(
      getTestByName('EscrowFinish having XRP escrowed'),
    )
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent(`\uE9000.0154 XRP`)
    expect(
      container.querySelector('[data-testid="escrow-tx"] .value'),
    ).toHaveTextContent(
      `3E2E755FA75FF1020C39E2ECC407E9F1C0E49A7229EDD15FF93B9F869878F1CC`,
    )
    unmount()
  })

  it('renders a smart escrow finish properly', () => {
    const { container, unmount } = renderComponent(mockEscrowFinishCompAllow)
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent(`\uE9000.10 XRP`)
    expect(
      container.querySelector('[data-testid="escrow-tx"] .value'),
    ).toHaveTextContent(
      `2C44A096646F815F9072D8FB3954B2B9025C21AE614CE96CB2D2C4907F9B2A1D`,
    )
    expect(
      container.querySelector('[data-testid="computation-allowance"] .value'),
    ).toHaveTextContent('1000000 gas')
    unmount()
  })

  it('test XRP amount', () => {
    const { container, unmount } = renderComponent(
      getTestByName('EscrowFinish having XRP escrowed'),
    )
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent(`\uE9000.0154 XRP`)

    unmount()
  })

  it('test IOU amount', () => {
    const { container, unmount } = renderComponent(
      getTestByName('EscrowFinish having IOU escrowed'),
    )
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent('1.00 ZZZ.rDb2kD2sibG5cxhz3VAoRFkmhPrca4JtL8')
    unmount()
  })

  it('test MPT amount', () => {
    const data = {
      assetScale: 4,
    }

    // @ts-ignore
    useQuery.mockImplementation(() => ({
      data,
    }))

    const { container, unmount } = renderComponent(
      getTestByName('EscrowFinish having MPT escrowed'),
    )
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent(
      '0.0001 MPT (0044E493C9FB70ADC1A604A5792643A38CA5887219C21C8C)',
    )
    unmount()
  })

  it('renders with CredentialIDs', () => {
    const { container, unmount } = renderComponent(
      mockEscrowFinishCredentialIDs,
    )
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent(`\uE9000.0154 XRP`)
    expect(
      container.querySelector('[data-testid="credential-id-0"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="credential-id-1"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="credential-id-0"] .value'),
    ).toHaveTextContent(
      '7B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A955',
    )
    expect(
      container.querySelector('[data-testid="credential-id-1"] .value'),
    ).toHaveTextContent(
      '8B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A956',
    )
    unmount()
  })
})
