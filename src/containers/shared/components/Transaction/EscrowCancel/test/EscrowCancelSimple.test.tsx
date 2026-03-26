import { useQuery } from 'react-query'
import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockEscrowCancel from './mock_data/EscrowCancel.json'

const renderComponent = createSimpleRenderFactory(Simple)

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

function getTestByName(name: string) {
  return mockEscrowCancel[name]
}

describe('EscrowCancelSimple', () => {
  it('renders with an expiration and offer', () => {
    const { container, unmount } = renderComponent(
      getTestByName('EscrowCancel having XRP escrowed'),
    )
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent(`\uE900135.79 XRP`)
    expect(
      container.querySelector('[data-testid="escrow-cancel"] .value'),
    ).toHaveTextContent('rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56 - 9')
    expect(
      container.querySelector('[data-testid="escrow-cancel-tx"] .value'),
    ).toHaveTextContent(
      `A979AD5C6A6C844913DA51D71BF5F0B8E254D9A211FA837C4B322C4A8FD358E6`,
    )
    unmount()
  })

  it('test XRP amount', () => {
    const { container, unmount } = renderComponent(
      getTestByName('EscrowCancel having XRP escrowed'),
    )
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent(`\uE900135.79 XRP`)

    unmount()
  })

  it('test IOU amount', () => {
    const { container, unmount } = renderComponent(
      getTestByName('EscrowCancel having IOU escrowed'),
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
      getTestByName('EscrowCancel having MPT escrowed'),
    )
    expect(
      container.querySelector('[data-testid="escrow-amount"] .value'),
    ).toHaveTextContent(
      '0.0001 MPT (0044E49BC9FB70ADC1A604A5792643A38CA5887219C21C8C)',
    )
    unmount()
  })
})
