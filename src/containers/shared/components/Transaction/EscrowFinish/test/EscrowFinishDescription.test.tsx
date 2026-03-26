import { useQuery } from 'react-query'
import mockEscrowFinish from './mock_data/EscrowFinish.json'
import { Description } from '../Description'
import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionRenderFactory } from '../../test'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

function getTestByName(name: string) {
  return mockEscrowFinish[name]
}

describe('EscrowFinishDescription', () => {
  it('renders description for EscrowFinish', () => {
    const { container, unmount } = renderComponent(
      getTestByName('EscrowFinish having XRP escrowed'),
    )
    expect(container.innerHTML).toBe(
      '<div>Completion was triggered by <a data-testid="account" title="r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8" class="account" href="/accounts/r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8">r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8</a></div><div data-testid="amount-line">The escrowed amount of <b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">0.0154</span> <span class="currency" data-testid="currency">XRP</span></span></b> was delivered to <a data-testid="account" title="r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8" class="account" href="/accounts/r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8">r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8</a><span> (<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">0.015388</span> <span class="currency" data-testid="currency">XRP</span></span></b> after transaction cost)</span></div>The escrow was created by <a data-testid="account" title="r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8" class="account" href="/accounts/r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8">r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8</a> with transaction <a class="hash" href="/transactions/3E2E755FA75FF1020C39E2ECC407E9F1C0E49A7229EDD15FF93B9F869878F1CC">3E2E75...</a><div>The escrow condition is fulfilled by<span class="fulfillment"> Fulfillment</span></div>',
    )
    unmount()
  })

  it('test XRP amount', () => {
    const { container, unmount } = renderComponent(
      getTestByName('EscrowFinish having XRP escrowed'),
    )
    expect(
      container.querySelector('[data-testid="amount-line"]'),
    ).toHaveTextContent(
      `The escrowed amount of \uE9000.0154 XRP was delivered to r4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8 (\uE9000.015388 XRP after transaction cost)`,
    )

    unmount()
  })

  it('test IOU amount', () => {
    const { container, unmount } = renderComponent(
      getTestByName('EscrowFinish having IOU escrowed'),
    )
    expect(
      container.querySelector('[data-testid="amount-line"]'),
    ).toHaveTextContent(
      'The escrowed amount of 1.00 ZZZ.rDb2kD2sibG5cxhz3VAoRFkmhPrca4JtL8 was delivered to rHVkbnz2ZLVUCPugCbLsXbCsayrJARLq1N',
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
    expect(
      container.querySelector('[data-testid="amount-line"]'),
    ).toHaveTextContent(
      'The escrowed amount of 0.0001 MPT (0044E493C9FB70ADC1A604A5792643A38CA5887219C21C8C) was delivered to rHVkbnz2ZLVUCPugCbLsXbCsayrJARLq1N',
    )
    unmount()
  })
})
