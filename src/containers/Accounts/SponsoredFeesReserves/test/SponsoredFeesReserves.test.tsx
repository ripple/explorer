import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router'
import i18n from '../../../../i18n/testConfigEnglish'
import { SponsoredFeesReserves } from '../index'
import type { AccountState } from '../../../../rippled/accountState'

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

const baseAccount: AccountState = {
  account: 'rAccount1111111111111111111111111',
  info: { ticketCount: 0, flags: [] },
  deleted: false,
}

describe('SponsoredFeesReserves Component', () => {
  it('renders no rows when the account has no sponsorship', () => {
    render(
      <TestWrapper>
        <SponsoredFeesReserves account={baseAccount} />
      </TestWrapper>,
    )

    expect(screen.getByText('Sponsored fees & reserves')).toBeInTheDocument()
    expect(screen.queryByText('Transaction Fees')).not.toBeInTheDocument()
    expect(screen.queryByText('Base Reserve')).not.toBeInTheDocument()
  })

  it('renders only the Base Reserve row when only the reserve is sponsored', () => {
    const account: AccountState = {
      ...baseAccount,
      info: {
        ...baseAccount.info,
        sponsor: 'rBaseReserveSponsor11111111111111',
      },
    }

    render(
      <TestWrapper>
        <SponsoredFeesReserves account={account} />
      </TestWrapper>,
    )

    expect(screen.getByText('Base Reserve')).toBeInTheDocument()
    expect(screen.queryByText('Transaction Fees')).not.toBeInTheDocument()
    expect(screen.getByTestId('account-component')).toHaveTextContent(
      'rBaseReserveSponsor11111111111111',
    )
  })

  it('renders only the Transaction Fees row when only fees are sponsored', () => {
    const account: AccountState = {
      ...baseAccount,
      sponsorship: [
        {
          owner: 'rFeeSponsor2222222222222222222222',
          sponsee: baseAccount.account,
        },
      ],
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
    const account: AccountState = {
      ...baseAccount,
      info: {
        ...baseAccount.info,
        sponsor: 'rBaseReserveSponsor11111111111111',
      },
      sponsorship: [
        {
          owner: 'rFeeSponsor2222222222222222222222',
          sponsee: baseAccount.account,
        },
      ],
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

  it('renders one Transaction Fees row per sponsor when there are multiple fee sponsors', () => {
    const account: AccountState = {
      ...baseAccount,
      sponsorship: [
        {
          owner: 'rFeeSponsor2222222222222222222222',
          sponsee: baseAccount.account,
        },
        {
          owner: 'rFeeSponsor3333333333333333333333',
          sponsee: baseAccount.account,
        },
      ],
    }

    render(
      <TestWrapper>
        <SponsoredFeesReserves account={account} />
      </TestWrapper>,
    )

    expect(screen.getAllByText('Transaction Fees')).toHaveLength(2)
    expect(screen.getAllByTestId('account-component')).toHaveLength(2)
    expect(screen.getAllByTestId('account-component')[0]).toHaveTextContent(
      'rFeeSponsor2222222222222222222222',
    )
    expect(screen.getAllByTestId('account-component')[1]).toHaveTextContent(
      'rFeeSponsor3333333333333333333333',
    )
  })
})
