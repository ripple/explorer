import { useQuery } from 'react-query'
import i18n from '../../../../../../i18n/testConfigEnglish'
import mockEscrowCreateTests from './mock_data/EscrowCreate.json'
import { Description } from '../Description'
import { createDescriptionWrapperFactory } from '../../test'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

function getTestByName(name: string) {
  return mockEscrowCreateTests[name]
}

describe('EscrowCreateDescription', () => {
  it('renders description for EscrowCreate', () => {
    const wrapper = createWrapper(getTestByName('renders EscrowCreate'))
    expect(wrapper.html()).toBe(
      'The escrow is from <a data-testid="account" title="rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi8q" class="account" href="/accounts/rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi8q">rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi8q</a> to <a data-testid="account" title="rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q" class="account" href="/accounts/rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q">rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q</a><div>The escrow has a fulfillment condition of<span class="condition"> A0258020886F982742772F414243855DC13B348FC78FB3D5119412C8A6480114E36A4451810120</span></div><div data-testid="amount-line">It escrowed<b> <span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">997.50</span> <span class="currency" data-testid="currency">XRP</span></span></b></div><div>It can be cancelled after<span class="time"> March 1, 2020 at 8:54:20 AM UTC</span></div><div>It can be finished after<span class="time"> March 1, 2020 at 9:01:00 AM UTC</span></div>',
    )
    wrapper.unmount()
  })

  it('test XRP amount', () => {
    const wrapper = createWrapper(getTestByName('renders EscrowCreate'))
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      `It escrowed uE900997.50 XRP`,
    )

    wrapper.unmount()
  })

  it('test IOU amount', () => {
    const wrapper = createWrapper(getTestByName('test IOU amount'))
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      `It escrowed 1.00 ZZZ.rDb2kD2sibG5cxhz3VAoRFkmhPrca4JtL8`,
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
      `It escrowed 0.0001 MPT (0044E48FC9FB70ADC1A604A5792643A38CA5887219C21C8C)`,
    )

    wrapper.unmount()
  })
})
