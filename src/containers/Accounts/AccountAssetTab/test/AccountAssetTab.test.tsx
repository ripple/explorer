import { mount } from 'enzyme'
import { QueryClientProvider } from 'react-query'
import { Route } from 'react-router-dom'
import i18n from '../../../../i18n/testConfig'
import { testQueryClient } from '../../../test/QueryClient'
import { flushPromises, QuickHarness } from '../../../test/utils'
import { AccountAssetTab } from '../AccountAssetTab'
import { ACCOUNT_ROUTE } from '../../../App/routes'

const mockAccountData = {
  account: 'rH3UU2acTY5fz4rYwMLMniivDqcPLjg6mk',
  info: {
    sequence: 6467288,
    ownerCount: 1,
    reserve: 1.2,
    flags: [],
    balance: '99999999',
    previousTxn:
      '3915E32DD06F670644EDF10EB1193C7B001209113B92A580D2C09B0FDE36E3BC',
    previousLedger: 6467291,
  },
  balances: {
    XRP: 99.999999,
  },
  tokens: [],
  deleted: false,
  hasBridge: false,
}

// Child tables mocked to isolate AccountAssetTab
jest.mock('../../AccountIssuedTokenTable', () => ({
  AccountIssuedTokenTable: ({ account }: any) => (
    <div className="issued-table">{account.account}-issued</div>
  ),
}))
jest.mock('../../AccountNFTTable/AccountNFTTable', () => ({
  AccountNFTTable: ({ accountId }: any) => (
    <div className="nft-table">{accountId}-nft</div>
  ),
}))
jest.mock('../../AccountMPTTable/AccountMPTTable', () => ({
  AccountMPTTable: ({ accountId }: any) => (
    <div className="mpt-table">{accountId}-mpt</div>
  ),
}))

describe('AccountAssetTab routing', () => {
  const createWrapper = (initialEntry: string, account) =>
    mount(
      <QueryClientProvider client={testQueryClient}>
        <QuickHarness i18n={i18n} initialEntries={[initialEntry]}>
          <Route
            path={ACCOUNT_ROUTE.path}
            element={<AccountAssetTab account={account} />}
          />
        </QuickHarness>
      </QueryClientProvider>,
    )

  it('renders issued tab by default', async () => {
    const wrapper = createWrapper(
      `/accounts/${mockAccountData.account}/assets/issued`,
      mockAccountData,
    )
    await flushPromises()
    wrapper.update()

    // Always show all 3 tabs
    expect(wrapper.find('.radio-group').children().length).toBe(3)

    expect(wrapper.find('.issued-table')).toExist()
    expect(wrapper.find('input[value="issued"]').prop('checked')).toBe(true)

    wrapper.unmount()
  })

  it('renders empty fragment when account is deleted', async () => {
    const wrapper = createWrapper(
      `/accounts/${mockAccountData.account}/assets/issued`,
      {
        deleted: true,
      },
    )
    await flushPromises()
    wrapper.update()

    expect(wrapper.html()).toBe('')
    wrapper.unmount()
  })

  it('renders nft tab when route param is nft', async () => {
    const wrapper = createWrapper(
      `/accounts/${mockAccountData.account}/assets/nft`,
      mockAccountData,
    )
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('.nft-table')).toExist()
    expect(wrapper.find('input[value="nft"]').prop('checked')).toBe(true)

    wrapper.unmount()
  })

  it('renders mpt tab when route param is mpt', async () => {
    const wrapper = createWrapper(
      `/accounts/${mockAccountData.account}/assets/mpt`,
      mockAccountData,
    )
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('.mpt-table')).toExist()
    expect(wrapper.find('input[value="mpt"]').prop('checked')).toBe(true)

    wrapper.unmount()
  })

  it('navigates when radio button is changed', async () => {
    const wrapper = createWrapper(
      `/accounts/${mockAccountData.account}/assets/mpt`,
      mockAccountData,
    )
    await flushPromises()
    wrapper.update()

    wrapper.find('input[value="mpt"]').simulate('change', {
      target: { value: 'mpt' },
    })

    await flushPromises()
    wrapper.update()
    expect(wrapper.find('.mpt-table')).toExist()

    wrapper.unmount()
  })
})
