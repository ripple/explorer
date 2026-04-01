import { render, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../../../i18n/testConfig'
import { AMMAccountHeader, AmmDataType } from '../AMMAccountHeader'
import { V7_FUTURE_ROUTER_FLAGS } from '../../../../../test/utils'
import { queryClient } from '../../../../../shared/QueryClient'

describe('AMM Account Header', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

  const renderAMMAccountHeader = (state: AmmDataType) =>
    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter
            initialEntries={[`accounts/${TEST_ACCOUNT_ID}`]}
            future={V7_FUTURE_ROUTER_FLAGS}
          >
            <AMMAccountHeader data={state} />
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>,
    )

  it('renders AMM account page', async () => {
    const state: AmmDataType = {
      balance: { currency: 'XRP', amount: 1000, issuer: 'hi' },
      balance2: { currency: 'USD', amount: 9000, issuer: 'hi' },
      lpBalance: 500,
      tradingFee: 10,
      accountId: 'rTEST_ACCOUNT',
      language: 'en-US',
    }

    const { container } = renderAMMAccountHeader(state)
    await waitFor(() => {
      // AMMAccountHeader renders with class 'account-header'
      expect(container.querySelectorAll('.account-header').length).toBe(1)
    })
    expect(container.querySelectorAll('.box-header .title').length).toBe(1)
    expect(container.querySelectorAll('.currency-pair').length).toBe(1)
    expect(container.textContent).toContain('500')
    expect(container.textContent).toContain('0.01%')
    expect(container.textContent).toContain('XRP.hi/USD.hi')
    expect(container.textContent).toContain('\uE9001,000')
    expect(container.textContent).toContain('9,000')
    expect(container.textContent).toContain('rTEST_ACCOUNT')
  })
})
