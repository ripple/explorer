import React from 'react'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router'
import AccountTransactionTable from 'containers/Accounts/AccountTransactionTable/AccountTransactionTable'
import { initialState } from 'rootReducer'
import i18n from 'i18nTestConfig'
import AMMAccountHeader from 'containers/Accounts/AMM/AMMAccounts/AMMAccountHeader/AMMAccountHeader'
import * as rippled from 'rippled/lib/rippled'
import NoMatch from 'containers/NoMatch'
import AMMAccounts from '../index'

const configureMockStore = require('redux-mock-store').default

describe('AMM Account Page', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const accountTransactions: any = {
    transactions: [
      {
        tx: {
          Amount: '10000000000',
          Amount2: { currency: 'USD', amount: '100000', issuer: 'your mom' },
        },
      },
    ],
  }

  const ammInfo: any = {
    amm: {
      Amount: '10000000000',
      Amount2: { currency: 'USD', value: '100000' },
      TradingFee: 10,
      AMMID: 'the id',
      LPToken: {
        value: '8989',
      },
    },
  }

  const createWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state })
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[`accounts/${TEST_ACCOUNT_ID}`]}>
            <Route path="accounts/:id" component={AMMAccounts} />
          </MemoryRouter>
        </Provider>
      </I18nextProvider>,
    )
  }

  it('renders AMM account page when TVL not present', async () => {
    const state = {
      ...initialState,
    }

    setSpy(accountTransactions, ammInfo)

    const wrapper = createWrapper(state)
    await flushPromises()
    wrapper.update()
    expect(wrapper.find(AMMAccountHeader).length).toBe(1)
    expect(wrapper.find(AccountTransactionTable).length).toBe(1)
    wrapper.unmount()
  })

  it('shows error when amm info data is formatted incorrectly', async () => {
    const state = {
      ...initialState,
    }

    setSpy(accountTransactions, 'ammInfo')

    const wrapper = createWrapper(state)
    await flushPromises()
    wrapper.update()
    expect(wrapper.find(AMMAccountHeader).length).toBe(0)
    expect(wrapper.find(AccountTransactionTable).length).toBe(0)
    expect(wrapper.find(NoMatch).length).toBe(1)
    wrapper.unmount()
  })

  it('shows error when account transactions data is formatted incorrectly', async () => {
    const state = {
      ...initialState,
    }
    const accTransBad: any = {
      transactions: [],
    }

    setSpy(accTransBad, ammInfo)

    const wrapper = createWrapper(state)
    await flushPromises()
    wrapper.update()
    expect(wrapper.find(AMMAccountHeader).length).toBe(0)
    expect(wrapper.find(AccountTransactionTable).length).toBe(0)
    expect(wrapper.find(NoMatch).length).toBe(1)
    wrapper.unmount()
  })
})

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve))
}

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
