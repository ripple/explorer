import { useQuery } from 'react-query'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import i18n from '../../../../../../i18n/testConfigEnglish'
import mockEscrowCreate from './mock_data/EscrowCreate.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

function getTestByName(name: string) {
  return mockEscrowCreate[name]
}

describe('EscrowCreateTableDetail', () => {
  it('renders EscrowCreate without crashing', () => {
    const { container, unmount } = renderComponent(
      getTestByName('renders EscrowCreate'),
    )
    expect(
      container.querySelector('[data-testid="account"]'),
    ).toHaveTextContent('rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q')
    expect(container.querySelector('[data-testid="amount"]')).toHaveTextContent(
      `997.50 XRP`,
    )
    expect(
      container.querySelector('[data-testid="condition"]'),
    ).toHaveTextContent(
      'A0258020886F982742772F414243855DC13B348FC78FB3D5119412C8A6480114E36A4451810120',
    )
    expect(
      container.querySelector('[data-testid="finish_after"]'),
    ).toHaveTextContent(`March 1, 2020 at 9:01:00 AM UTC`)
    expect(
      container.querySelector('[data-testid="cancel_after"]'),
    ).toHaveTextContent(`March 1, 2020 at 8:54:20 AM UTC`)

    unmount()
  })

  it('test XRP amount', () => {
    const { container, unmount } = renderComponent(
      getTestByName('renders EscrowCreate'),
    )
    expect(container.querySelector('[data-testid="amount"]')).toHaveTextContent(
      `\uE900997.50 XRP`,
    )

    unmount()
  })

  it('test IOU amount', () => {
    const { container, unmount } = renderComponent(
      getTestByName('test IOU amount'),
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
      getTestByName('test MPT amount'),
    )
    expect(container.querySelector('[data-testid="amount"]')).toHaveTextContent(
      `0.0001 MPT (0044E48FC9FB70ADC1A604A5792643A38CA5887219C21C8C)`,
    )

    unmount()
  })
})
