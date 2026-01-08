import { useQuery } from 'react-query'
import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockEscrowFinish from './mock_data/EscrowFinish.json'
import mockEscrowFinishCompAllow from './mock_data/EscrowFinishComputationAllowance.json'
import mockEscrowFinishCredentialIDs from './mock_data/EscrowFinishWithCredentialIDs.json'

const createWrapper = createSimpleWrapperFactory(Simple)

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

function getTestByName(name: string) {
  return mockEscrowFinish[name]
}

describe('EscrowFinishSimple', () => {
  it('renders with an expiration and offer', () => {
    const wrapper = createWrapper(
      getTestByName('EscrowFinish having XRP escrowed'),
    )
    expect(wrapper.find('[data-testid="escrow-amount"] .value')).toHaveText(
      `\uE9000.0154 XRP`,
    )
    expect(wrapper.find('[data-testid="escrow-tx"] .value')).toHaveText(
      `3E2E755FA75FF1020C39E2ECC407E9F1C0E49A7229EDD15FF93B9F869878F1CC`,
    )
    wrapper.unmount()
  })

  it('renders a smart escrow finish properly', () => {
    const wrapper = createWrapper(mockEscrowFinishCompAllow)
    expect(wrapper.find('[data-testid="escrow-amount"] .value')).toHaveText(
      `\uE9000.10 XRP`,
    )
    expect(wrapper.find('[data-testid="escrow-tx"] .value')).toHaveText(
      `2C44A096646F815F9072D8FB3954B2B9025C21AE614CE96CB2D2C4907F9B2A1D`,
    )
    expect(
      wrapper.find('[data-testid="computation-allowance"] .value'),
    ).toHaveText('1000000 gas')
    wrapper.unmount()
  })

  it('test XRP amount', () => {
    const wrapper = createWrapper(
      getTestByName('EscrowFinish having XRP escrowed'),
    )
    expect(wrapper.find('[data-testid="escrow-amount"] .value')).toHaveText(
      `\uE9000.0154 XRP`,
    )

    wrapper.unmount()
  })

  it('test IOU amount', () => {
    const wrapper = createWrapper(
      getTestByName('EscrowFinish having IOU escrowed'),
    )
    expect(wrapper.find('[data-testid="escrow-amount"] .value')).toHaveText(
      '1.00 ZZZ.rDb2kD2sibG5cxhz3VAoRFkmhPrca4JtL8',
    )
    wrapper.unmount()
  })

  it('test MPT amount', () => {
    const data = {
      assetScale: 4,
    }

    // @ts-ignore
    useQuery.mockImplementation(() => ({
      data,
    }))

    const wrapper = createWrapper(
      getTestByName('EscrowFinish having MPT escrowed'),
    )
    expect(wrapper.find('[data-testid="escrow-amount"] .value')).toHaveText(
      '0.0001 MPT (0044E493C9FB70ADC1A604A5792643A38CA5887219C21C8C)',
    )
    wrapper.unmount()
  })

  it('renders with CredentialIDs', () => {
    const wrapper = createWrapper(mockEscrowFinishCredentialIDs)
    expect(wrapper.find('[data-testid="escrow-amount"] .value')).toHaveText(
      `\uE9000.0154 XRP`,
    )
    expect(wrapper.find('[data-testid="credential-id-0"]')).toExist()
    expect(wrapper.find('[data-testid="credential-id-1"]')).toExist()
    expect(wrapper.find('[data-testid="credential-id-0"] .value')).toHaveText(
      '7B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A955',
    )
    expect(wrapper.find('[data-testid="credential-id-1"] .value')).toHaveText(
      '8B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A956',
    )
    wrapper.unmount()
  })
})
