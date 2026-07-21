import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router'
import i18n from '../../../../i18n/testConfigEnglish'
import { SponsoredFeesReserves } from '../index'

jest.mock('../../../shared/components/Account', () => ({
  Account: ({ account }: { account: string }) => (
    <span data-testid="account-component">{account}</span>
  ),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <Router>{children}</Router>
  </I18nextProvider>
)

describe('SponsoredFeesReserves Component', () => {
  it('renders nothing when the account has no sponsorship', () => {
    const account = { info: {} }

    const { container } = render(
      <TestWrapper>
        <SponsoredFeesReserves account={account} />
      </TestWrapper>,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders only the Base Reserve row when only the reserve is sponsored', () => {
    const account = { info: { sponsor: 'rBaseReserveSponsor11111111111111' } }

    render(
      <TestWrapper>
        <SponsoredFeesReserves account={account} />
      </TestWrapper>,
    )

    expect(screen.getByText('Sponsored fees & reserves')).toBeInTheDocument()
    expect(screen.getByText('Base Reserve')).toBeInTheDocument()
    expect(screen.queryByText('Transaction Fees')).not.toBeInTheDocument()
    expect(screen.getByTestId('account-component')).toHaveTextContent(
      'rBaseReserveSponsor11111111111111',
    )
  })

  it('renders only the Transaction Fees row when only fees are sponsored', () => {
    const account = {
      info: {},
      sponsorship: { owner: 'rFeeSponsor2222222222222222222222' },
    }

    render(
      <TestWrapper>
        <SponsoredFeesReserves account={account} />
      </TestWrapper>,
    )

    expect(screen.getByText('Transaction Fees')).toBeInTheDocument()
    expect(screen.queryByText('Base Reserve')).not.toBeInTheDocument()
    expect(screen.getByTestId('account-component')).toHaveTextContent(
      'rFeeSponsor2222222222222222222222',
    )
  })

  it('renders both rows when both fees and reserve are sponsored', () => {
    const account = {
      info: { sponsor: 'rBaseReserveSponsor11111111111111' },
      sponsorship: { owner: 'rFeeSponsor2222222222222222222222' },
    }

    render(
      <TestWrapper>
        <SponsoredFeesReserves account={account} />
      </TestWrapper>,
    )

    expect(screen.getByText('Transaction Fees')).toBeInTheDocument()
    expect(screen.getByText('Base Reserve')).toBeInTheDocument()
    expect(screen.getAllByTestId('account-component')).toHaveLength(2)
    expect(screen.getAllByText('Active')).toHaveLength(2)
  })
})
