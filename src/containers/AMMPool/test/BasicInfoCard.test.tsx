import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import { BasicInfoCard } from '../InfoCards/BasicInfoCard'

const defaults = {
  ammAccountId: 'rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG',
  tradingFee: 864,
  createdTimestamp: 827617760 as number | null | undefined,
  lpTokenCurrency: '03CE60C3DB22CF7F7157810936F27A5B485C8DB9' as
    | string
    | undefined,
}

const renderComponent = (overrides: Partial<typeof defaults> = {}) => {
  const props = { ...defaults, ...overrides }
  return render(
    <I18nextProvider i18n={i18n}>
      <BasicInfoCard
        ammAccountId={props.ammAccountId}
        tradingFee={props.tradingFee}
        createdTimestamp={props.createdTimestamp}
        lpTokenCurrency={props.lpTokenCurrency}
      />
    </I18nextProvider>,
  )
}

describe('BasicInfoCard', () => {
  it('renders Basic Info title', () => {
    renderComponent()
    expect(screen.getByText('basic_info')).toBeInTheDocument()
  })

  it('renders AMM Account ID label', () => {
    renderComponent()
    expect(screen.getByText('amm_account_id')).toBeInTheDocument()
  })

  it('renders trading fee without truncation', () => {
    renderComponent()
    // 864 / 1000 = 0.864, should show 0.864% not 0.86%
    expect(screen.getByText('0.864%')).toBeInTheDocument()
  })

  it('renders trading fee of 1000 as 1%', () => {
    renderComponent({ tradingFee: 1000 })
    expect(screen.getByText('1%')).toBeInTheDocument()
  })

  it('renders LP Token label', () => {
    renderComponent()
    expect(screen.getByText('lp_token_currency_code')).toBeInTheDocument()
  })

  it('shows LP Token as second row after AMM Account ID', () => {
    const { container } = renderComponent()
    const rows = container.querySelectorAll('.info-card-row')
    expect(rows.length).toBe(4)
    // Order: AMM Account ID, LP Token, Trading Fee, Created On
    expect(rows[0]).toHaveTextContent('amm_account_id')
    expect(rows[1]).toHaveTextContent('lp_token_currency_code')
    expect(rows[2]).toHaveTextContent('trading_fee')
    expect(rows[3]).toHaveTextContent('created_on')
  })

  it('shows -- for created date when timestamp is null', () => {
    renderComponent({ createdTimestamp: null })
    const rows = Array.from(document.querySelectorAll('.info-card-row'))
    const createdRow = rows.find((r) => r.textContent?.includes('created_on'))
    expect(createdRow).toHaveTextContent('--')
  })

  it('does not render LP Token row when lpTokenCurrency is undefined', () => {
    renderComponent({ lpTokenCurrency: undefined })
    const rows = document.querySelectorAll('.info-card-row')
    expect(rows.length).toBe(3)
  })
})
