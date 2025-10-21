import { useQuery } from 'react-query'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import i18n from '../../../../../../i18n/testConfigEnglish'
import mockEscrowCreate from './mock_data/EscrowCreate.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

function getTestByName(name: string) {
  return mockEscrowCreate[name]
}

describe('EscrowCreateTableDetail', () => {
  it('renders EscrowCreate without crashing', () => {
    const wrapper = createWrapper(getTestByName('renders EscrowCreate'))
    expect(wrapper.find('[data-testid="account"]')).toHaveText(
      ` rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q `,
    )
    expect(wrapper.find('[data-testid="amount"]')).toHaveText(`997.50 XRP`)
    expect(wrapper.find('[data-testid="condition"]')).toHaveText(
      ` A0258020886F982742772F414243855DC13B348FC78FB3D5119412C8A6480114E36A4451810120 `,
    )
    expect(wrapper.find('[data-testid="finish_after"]')).toHaveText(
      `March 1, 2020 at 9:01:00 AM UTC`,
    )
    expect(wrapper.find('[data-testid="cancel_after"]')).toHaveText(
      `March 1, 2020 at 8:54:20 AM UTC`,
    )

    wrapper.unmount()
  })

  it('test XRP amount', () => {
    const wrapper = createWrapper(getTestByName('renders EscrowCreate'))
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      `\uE900997.50 XRP`,
    )

    wrapper.unmount()
  })

  it('test IOU amount', () => {
    const wrapper = createWrapper(getTestByName('test IOU amount'))
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
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

    const wrapper = createWrapper(getTestByName('test MPT amount'))
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      `0.0001 MPT (0044E48FC9FB70ADC1A604A5792643A38CA5887219C21C8C)`,
    )

    wrapper.unmount()
  })
})
