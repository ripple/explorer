import { useQuery } from 'react-query'
import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockEscrowCancel from './mock_data/EscrowCancel.json'

const createWrapper = createSimpleWrapperFactory(Simple)

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

function getTestByName(name: string) {
  return mockEscrowCancel[name]
}

describe('EscrowCancelSimple', () => {
  it('renders with an expiration and offer', () => {
    const wrapper = createWrapper(
      getTestByName('EscrowCancel having XRP escrowed'),
    )
    expect(wrapper.find('[data-testid="escrow-amount"] .value')).toHaveText(
      `\uE900135.79 XRP`,
    )
    expect(wrapper.find('[data-testid="escrow-cancel"] .value')).toHaveText(
      'rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56 - 9',
    )
    expect(wrapper.find('[data-testid="escrow-cancel-tx"] .value')).toHaveText(
      `A979AD5C6A6C844913DA51D71BF5F0B8E254D9A211FA837C4B322C4A8FD358E6`,
    )
    wrapper.unmount()
  })

  it('test XRP amount', () => {
    const wrapper = createWrapper(
      getTestByName('EscrowCancel having XRP escrowed'),
    )
    expect(wrapper.find('[data-testid="escrow-amount"] .value')).toHaveText(
      `\uE900135.79 XRP`,
    )

    wrapper.unmount()
  })

  it('test IOU amount', () => {
    const wrapper = createWrapper(
      getTestByName('EscrowCancel having IOU escrowed'),
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
      getTestByName('EscrowCancel having MPT escrowed'),
    )
    expect(wrapper.find('[data-testid="escrow-amount"] .value')).toHaveText(
      '0.0001 MPT (0044E49BC9FB70ADC1A604A5792643A38CA5887219C21C8C)',
    )
    wrapper.unmount()
  })
})
