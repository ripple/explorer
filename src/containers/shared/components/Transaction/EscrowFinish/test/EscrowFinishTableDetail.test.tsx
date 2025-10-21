import { useQuery } from 'react-query'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockEscrowFinish from './mock_data/EscrowFinish.json'
import i18n from '../../../../../../i18n/testConfigEnglish'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

function getTestByName(name: string) {
  return mockEscrowFinish[name]
}

describe('EscrowFinishTableDetail', () => {
  it('renders EscrowFinish without crashing', () => {
    const wrapper = createWrapper(
      getTestByName('EscrowFinish having XRP escrowed'),
    )
    expect(wrapper.find('[data-testid="escrow-account"]')).toHaveText(
      `finish escrowr4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8 -28`,
    )
    expect(wrapper.find('[data-testid="escrow-amount"]')).toHaveText(
      `\uE9000.0154 XRP`,
    )
    expect(wrapper.find('[data-testid="escrow-fulfillment"]')).toHaveText(
      `fulfillment Fulfillment `,
    )
    wrapper.unmount()
  })

  it('test XRP amount', () => {
    const wrapper = createWrapper(
      getTestByName('EscrowFinish having XRP escrowed'),
    )
    expect(wrapper.find('[data-testid="escrow-amount"]')).toHaveText(
      `\uE9000.0154 XRP`,
    )

    wrapper.unmount()
  })

  it('test IOU amount', () => {
    const wrapper = createWrapper(
      getTestByName('EscrowFinish having IOU escrowed'),
    )
    expect(wrapper.find('[data-testid="escrow-amount"]')).toHaveText(
      `1.00 ZZZ.rDb2kD2sibG5cxhz3VAoRFkmhPrca4JtL8`,
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
    expect(wrapper.find('[data-testid="escrow-amount"]')).toHaveText(
      `0.0001 MPT (0044E493C9FB70ADC1A604A5792643A38CA5887219C21C8C)`,
    )

    wrapper.unmount()
  })
})
