import { useQuery } from 'react-query'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockEscrowFinish from './mock_data/EscrowFinish.json'
import i18n from '../../../../../../i18n/testConfigEnglish'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

function getTestByName(name: string) {
  return mockEscrowFinish[name]
}

describe('EscrowFinishTableDetail', () => {
  it('renders EscrowFinish without crashing', () => {
    const { container, unmount } = renderComponent(
      getTestByName('EscrowFinish having XRP escrowed'),
    )
    expect(
      container.querySelector('[data-testid="escrow-account"]'),
    ).toHaveTextContent(`finish escrowr4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8 -28`)
    expect(container.querySelector('[data-testid="amount"]')).toHaveTextContent(
      `\uE9000.0154 XRP`,
    )
    expect(
      container.querySelector('[data-testid="escrow-fulfillment"]'),
    ).toHaveTextContent(`fulfillment Fulfillment`)
    unmount()
  })

  it('test XRP amount', () => {
    const { container, unmount } = renderComponent(
      getTestByName('EscrowFinish having XRP escrowed'),
    )
    expect(container.querySelector('[data-testid="amount"]')).toHaveTextContent(
      `\uE9000.0154 XRP`,
    )

    unmount()
  })

  it('test IOU amount', () => {
    const { container, unmount } = renderComponent(
      getTestByName('EscrowFinish having IOU escrowed'),
    )
    expect(container.querySelector('[data-testid="amount"]')).toHaveTextContent(
      `1.00 ZZZ.rDb2kD2sibG5cxhz3VAoRFkmhPrca4JtL8`,
    )

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
    expect(container.querySelector('[data-testid="amount"]')).toHaveTextContent(
      `0.0001 MPT (0044E493C9FB70ADC1A604A5792643A38CA5887219C21C8C)`,
    )

    unmount()
  })
})
