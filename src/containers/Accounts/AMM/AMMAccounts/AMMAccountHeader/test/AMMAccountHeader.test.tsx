import React from 'react'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { initialState } from 'rootReducer'
import i18n from 'i18nTestConfig'
import configureMockStore from 'redux-mock-store'
import { AMMAccountHeader, AmmDataType } from '../AMMAccountHeader'

describe('AMM Account Header', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const createWrapper = (state: AmmDataType) => {
    const store = mockStore({ ...initialState, ...state })
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[`accounts/${TEST_ACCOUNT_ID}`]}>
            <AMMAccountHeader data={state} />
          </MemoryRouter>
        </Provider>
      </I18nextProvider>,
    )
  }

  it('renders AMM account page', async () => {
    const state: AmmDataType = {
      balance: { currency: 'XRP', amount: 1000, issuer: 'hi' },
      balance2: { currency: 'USD', amount: 9000, issuer: 'hi' },
      lpBalance: 500,
      tradingFee: 10,
      accountId: 'rTEST_ACCOUNT',
      language: 'en-US',
    }

    const wrapper = createWrapper(state)
    await flushPromises()
    wrapper.update()
    expect(wrapper.find(AMMAccountHeader).length).toBe(1)
    expect(wrapper.find('.amm-title').length).toBe(1)
    expect(wrapper.find('.currency-pair').length).toBe(1)
    expect(wrapper.text().includes('500')).toBe(true)
    expect(wrapper.text().includes('%0.01')).toBe(true)
    expect(wrapper.text().includes('XRP.hi/USD.hi')).toBe(true)
    expect(wrapper.text().includes('\uE9001,000')).toBe(true)
    expect(wrapper.text().includes('9,000')).toBe(true)
    expect(wrapper.text().includes('rTEST_ACCOUNT')).toBe(true)

    wrapper.unmount()
  })
})

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve))
}
