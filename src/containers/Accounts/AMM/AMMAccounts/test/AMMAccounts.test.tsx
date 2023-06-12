import { mount } from 'enzyme'
import { Route } from 'react-router'
import i18n from '../../../../../i18n/testConfig'
import * as rippled from '../../../../../rippled/lib/rippled'
import NoMatch from '../../../../NoMatch'
import { AMMAccountHeader } from '../AMMAccountHeader/AMMAccountHeader'
import { AccountTransactionTable } from '../../../AccountTransactionTable'
import { AMMAccounts } from '../index'
import { flushPromises, QuickHarness } from '../../../../test/utils'
import { ACCOUNT } from '../../../../App/routes'

function setSpy(accountTransactions: any, ammInfo: any) {
  const spyInfo = jest.spyOn(rippled, 'getAMMInfo')
  const spyTransactions = jest.spyOn(rippled, 'getAccountTransactions')
  spyTransactions.mockReturnValue(
    new Promise((resolve) => {
      resolve(accountTransactions)
    }),
  )
  spyInfo.mockReturnValue(
    new Promise((resolve) => {
      resolve(ammInfo)
    }),
  )
}

describe('AMM Account Page', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'
  const accountTransactions: any = {
    transactions: [
      {
        tx: {
          Amount: '10000000000',
          Amount2: { currency: 'USD', amount: '100000', issuer: 'SOLO' },
          TransactionType: 'AMMCreate',
        },
      },
    ],
  }

  const ammInfo: any = {
    amm: {
      amount: '10000000000',
      amount2: { currency: 'USD', value: '100000' },
      trading_fee: 10,
      lp_token: {
        value: '8989',
      },
    },
  }

  const createWrapper = () =>
    mount(
      <QuickHarness
        i18n={i18n}
        initialEntries={[`/accounts/${TEST_ACCOUNT_ID}`]}
      >
        <Route path={ACCOUNT.path} element={<AMMAccounts />} />
      </QuickHarness>,
    )

  it('renders AMM account page when TVL not present', async () => {
    setSpy(accountTransactions, ammInfo)

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()
    expect(wrapper.find(AMMAccountHeader).length).toBe(1)
    expect(wrapper.find(AccountTransactionTable).length).toBe(1)
    wrapper.unmount()
  })

  it('shows error when amm info data is formatted incorrectly', async () => {
    setSpy(accountTransactions, 'ammInfo')

    const wrapper = await createWrapper()
    await flushPromises()
    wrapper.update()
    expect(wrapper.find(AMMAccountHeader).length).toBe(0)
    expect(wrapper.find(AccountTransactionTable).length).toBe(0)
    expect(wrapper.find(NoMatch).length).toBe(1)
    wrapper.unmount()
  })

  it('shows error when account transactions data is formatted incorrectly', async () => {
    const accTransBad: any = {
      transactions: [],
    }

    setSpy(accTransBad, ammInfo)

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()
    expect(wrapper.find(AMMAccountHeader).length).toBe(0)
    expect(wrapper.find(AccountTransactionTable).length).toBe(0)
    expect(wrapper.find(NoMatch).length).toBe(1)
    wrapper.unmount()
  })
})
