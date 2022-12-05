import React from 'react'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { initialState } from 'rootReducer'
import i18n from 'i18nTestConfig'
import AMMAccountHeader from 'containers/Accounts/AMM/AMMAccounts/AMMAccountHeader/AMMAccountHeader'
import { AmmDataType } from '../../index'

const configureMockStore = require('redux-mock-store').default

describe('AMM Account Header', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const creatWrapper = (state: AmmDataType) => {
    const store = mockStore({ ...initialState, ...state })
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[`accounts/${TEST_ACCOUNT_ID}`]}>
            <AMMAccountHeader {...state} />
          </MemoryRouter>
        </Provider>
      </I18nextProvider>,
    )
  }

  it('renders AMM account page', async () => {
    const state: AmmDataType = {
      ...initialState,
      balance: { currency: 'XRP', amount: 1000, issuer: 'hi' },
      balance2: { currency: 'USD', amount: 9000, issuer: 'hi' },
      lpBalance: 500,
      ammId: 'some amm id',
      tradingFee: 10,
      accountId: 'the account ID',
      language: 'en-US',
    }

    const wrapper = creatWrapper(state)
    await flushPromises()
    wrapper.update()
    expect(wrapper.find(AMMAccountHeader).length).toBe(1)
    expect(wrapper.find('.amm-title').length).toBe(1)
    expect(wrapper.find('.currency-pair').length).toBe(1)
    expect(wrapper.text().includes('500')).toBe(true)
    expect(wrapper.text().includes('%0.01')).toBe(true)
    expect(wrapper.text().includes('XRP/USD')).toBe(true)
    expect(wrapper.text().includes('1,000')).toBe(true)
    expect(wrapper.text().includes('9,000')).toBe(true)
    expect(wrapper.text().includes('the account ID')).toBe(true)

    wrapper.unmount()
  })
})

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve))
}
