import { useQuery } from 'react-query'
import mockEscrowCancel from './mock_data/EscrowCancel.json'
import { Description } from '../Description'
import { createDescriptionWrapperFactory } from '../../test'
import i18n from '../../../../../../i18n/testConfigEnglish'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

function getTestByName(name: string) {
  return mockEscrowCancel[name]
}

describe('EscrowCancelDescription', () => {
  it('renders description for EscrowCancel', () => {
    const wrapper = createWrapper(
      getTestByName('EscrowCancel having XRP escrowed'),
    )
    expect(wrapper.html()).toBe(
      '<div>Cancellation was triggered by <a data-testid="account" title="rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56" class="account" href="/accounts/rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56">rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56</a></div><div data-testid="amount-line">The escrowed amount of <b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">135.79</span> <span class="currency" data-testid="currency">XRP</span></span></b> was returned to <a data-testid="account" title="rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56" class="account" href="/accounts/rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56">rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56</a><span> (<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">135.78999</span> <span class="currency" data-testid="currency">XRP</span></span></b> after transaction cost)</span></div>The escrow was created by <a data-testid="account" title="rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56" class="account" href="/accounts/rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56">rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56</a> with transaction <a class="hash" href="/transactions/A979AD5C6A6C844913DA51D71BF5F0B8E254D9A211FA837C4B322C4A8FD358E6">A979AD...</a>',
    )
    wrapper.unmount()
  })

  it('test XRP amount', () => {
    const wrapper = createWrapper(
      getTestByName('EscrowCancel having XRP escrowed'),
    )
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      `The escrowed amount of \uE900135.79 XRP was returned to rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56 (\uE900135.78999 XRP after transaction cost)`,
    )

    wrapper.unmount()
  })

  it('test IOU amount', () => {
    const wrapper = createWrapper(
      getTestByName('EscrowCancel having IOU escrowed'),
    )
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      'The escrowed amount of 1.00 ZZZ.rDb2kD2sibG5cxhz3VAoRFkmhPrca4JtL8 was returned to rDtpgHpsUFu2dHC6fMZnwgZvNEDZ9MG9YK',
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
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      'The escrowed amount of 0.0001 MPT (0044E49BC9FB70ADC1A604A5792643A38CA5887219C21C8C) was returned to r4ipomC348PqM2rGSBmhfRPXUH6CzKS1XJ',
    )
    wrapper.unmount()
  })
})
