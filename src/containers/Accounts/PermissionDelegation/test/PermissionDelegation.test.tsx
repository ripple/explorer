import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { PermissionDelegation } from '../index'
import { getAccountObjects } from '../../../../rippled/lib/rippled'
import { queryClient } from '../../../shared/QueryClient'
import Mock = jest.Mock

jest.mock('../../../../rippled/lib/rippled')
jest.mock('../../../../rippled/lib/logger', () => ({
  __esModule: true,
  default: () => ({
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  }),
}))

const mockedGetAccountObjects = getAccountObjects as Mock

const mockSocket = {} as any

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <Router>
      <SocketContext.Provider value={mockSocket}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SocketContext.Provider>
    </Router>
  </I18nextProvider>
)

const mockDelegateResponse = {
  account_objects: [
    {
      Account: 'rTestAccount123456789012345678901',
      Authorize: 'rN7n7otQDd6FczFgLdlqtyMVrn5f4W01dn',
      Permissions: [
        { Permission: { PermissionValue: 'Payment' } },
        { Permission: { PermissionValue: 'TrustSet' } },
      ],
      LedgerEntryType: 'Delegate',
    },
    {
      Account: 'rTestAccount123456789012345678901',
      Authorize: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
      Permissions: [
        { Permission: { PermissionValue: 'OfferCreate' } },
      ],
      LedgerEntryType: 'Delegate',
    },
  ],
}

describe('PermissionDelegation component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  afterEach(cleanup)

  it('renders nothing when there are no delegations', async () => {
    mockedGetAccountObjects.mockResolvedValue({ account_objects: [] })

    const { container } = render(
      <TestWrapper>
        <PermissionDelegation accountId="rTestAccount123456789012345678901" />
      </TestWrapper>,
    )

    await waitFor(() => {
      expect(mockedGetAccountObjects).toHaveBeenCalledWith(
        mockSocket,
        'rTestAccount123456789012345678901',
        'delegate',
      )
    })

    expect(container.querySelector('.permission-delegation')).toBeNull()
  })

  it('renders the section title and table headers when delegations exist', async () => {
    mockedGetAccountObjects.mockResolvedValue(mockDelegateResponse)

    render(
      <TestWrapper>
        <PermissionDelegation accountId="rTestAccount123456789012345678901" />
      </TestWrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Permission delegation')).toBeInTheDocument()
    })

    expect(screen.getByText('Permission')).toBeInTheDocument()
    expect(screen.getByText('Granted To')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders all permission rows from delegate objects', async () => {
    mockedGetAccountObjects.mockResolvedValue(mockDelegateResponse)

    render(
      <TestWrapper>
        <PermissionDelegation accountId="rTestAccount123456789012345678901" />
      </TestWrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Payment')).toBeInTheDocument()
    })

    expect(screen.getByText('TrustSet')).toBeInTheDocument()
    expect(screen.getByText('OfferCreate')).toBeInTheDocument()

    const activeStatuses = screen.getAllByText('Active')
    expect(activeStatuses).toHaveLength(3)
  })

  it('reuses AccountAsset CSS classes', async () => {
    mockedGetAccountObjects.mockResolvedValue(mockDelegateResponse)

    const { container } = render(
      <TestWrapper>
        <PermissionDelegation accountId="rTestAccount123456789012345678901" />
      </TestWrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Permission delegation')).toBeInTheDocument()
    })

    expect(container.querySelector('.account-asset')).not.toBeNull()
    expect(container.querySelector('.asset-section-header')).not.toBeNull()
    expect(container.querySelector('.account-asset-title')).not.toBeNull()
    expect(container.querySelector('.asset-section-toggle')).not.toBeNull()
    expect(container.querySelector('.account-asset-table')).not.toBeNull()
  })

  it('toggles the table visibility when clicking the toggle button', async () => {
    mockedGetAccountObjects.mockResolvedValue(mockDelegateResponse)

    render(
      <TestWrapper>
        <PermissionDelegation accountId="rTestAccount123456789012345678901" />
      </TestWrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText('Payment')).toBeInTheDocument()
    })

    expect(screen.getByText('Payment')).toBeVisible()

    const toggleButton = screen.getByLabelText('Toggle permission delegation')
    fireEvent.click(toggleButton)

    expect(screen.queryByText('Payment')).toBeNull()

    fireEvent.click(toggleButton)

    expect(screen.getByText('Payment')).toBeInTheDocument()
  })
})

