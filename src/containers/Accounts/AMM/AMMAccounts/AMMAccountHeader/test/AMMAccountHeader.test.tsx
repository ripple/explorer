import { render, screen, cleanup } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../../../i18n/testConfig'
import { AMMAccountHeader, AmmDataType } from '../AMMAccountHeader'
import { flushPromises } from '../../../../../test/utils'
import { queryClient } from '../../../../../shared/QueryClient'

describe('AMM Account Header', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

  const renderComponent = (state: AmmDataType) =>
    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={[`accounts/${TEST_ACCOUNT_ID}`]}>
            <AMMAccountHeader data={state} />
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>,
    )

  afterEach(cleanup)

  it('renders AMM account page', async () => {
    const state: AmmDataType = {
      balance: { currency: 'XRP', amount: 1000, issuer: 'hi' },
      balance2: { currency: 'USD', amount: 9000, issuer: 'hi' },
      lpBalance: 500,
      tradingFee: 10,
      accountId: 'rTEST_ACCOUNT',
      language: 'en-US',
    }

    const { container } = renderComponent(state)
    await flushPromises()

    expect(screen.queryAllByTestId('amm-header')).toHaveLength(1)
    expect(screen.queryAllByText('Account ID')).toHaveLength(1)
    expect(screen.getAllByTestId('currency-pair')).toHaveLength(1)
    expect(container).toHaveTextContent('500')
    expect(container).toHaveTextContent('0.01%')
    expect(container).toHaveTextContent('XRP.hi/USD.hi')
    expect(container).toHaveTextContent('\uE9001,000')
    expect(container).toHaveTextContent('9,000')
    expect(container).toHaveTextContent('rTEST_ACCOUNT')
  })
})
