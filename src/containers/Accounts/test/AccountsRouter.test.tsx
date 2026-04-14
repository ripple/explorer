import { render, screen, waitFor } from '@testing-library/react'
import { Route } from 'react-router'
import i18n from '../../../i18n/testConfig'
import { AccountsRouter } from '../AccountsRouter'
import { QuickHarness } from '../../test/utils'
import { ACCOUNT_ROUTE } from '../../App/routes'
import * as rippled from '../../../rippled/lib/rippled'
import * as ammUtils from '../../AMMPool/utils'
import { Error as RippledError } from '../../../rippled/lib/utils'

jest.mock('../../../rippled/lib/rippled')
jest.mock('../../AMMPool/utils')

jest.mock('../index', () => ({
  __esModule: true,
  Accounts: () => <div data-testid="accounts-page">Accounts Page</div>,
}))

const mockGetAccountInfo = rippled.getAccountInfo as jest.Mock
const mockDetectDeletedAMM = ammUtils.getDeletedAMMData as jest.Mock

describe('AccountsRouter', () => {
  const ACTIVE_AMM_ACCOUNT = 'rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG'
  const DELETED_AMM_ACCOUNT = 'raxKnsu4ea6xoehws1tyvc7W2XPM5VcmJp'
  const REGULAR_ACCOUNT = 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM'
  const DELETED_ACCOUNT = 'rwGBCTYmPQ8NrfDVL5DdzS3aBbiXtbwngA'

  const renderRouter = (accountId: string) =>
    render(
      <QuickHarness i18n={i18n} initialEntries={[`/accounts/${accountId}`]}>
        <Route path={ACCOUNT_ROUTE.path} element={<AccountsRouter />} />
      </QuickHarness>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('redirects to /amm/:id when account has AMMID', async () => {
    mockGetAccountInfo.mockResolvedValue({
      AMMID: '0422F98444F7B068C7EC6EEDAF11380E6A146F091639A29E09B3399C1F8A5341',
      Account: ACTIVE_AMM_ACCOUNT,
    })

    renderRouter(ACTIVE_AMM_ACCOUNT)

    await waitFor(() => {
      // Navigate component redirects, so the Accounts page should NOT render
      expect(screen.queryByTestId('accounts-page')).not.toBeInTheDocument()
    })
  })

  it('renders Accounts page for a regular account', async () => {
    mockGetAccountInfo.mockResolvedValue({
      Account: REGULAR_ACCOUNT,
      Balance: '1000000000',
    })

    renderRouter(REGULAR_ACCOUNT)

    await waitFor(() => {
      expect(screen.getByTestId('accounts-page')).toBeInTheDocument()
    })
  })

  it('renders Accounts page for a deleted non-AMM account', async () => {
    const error = new RippledError('Account not found', 404)
    mockGetAccountInfo.mockRejectedValue(error)
    mockDetectDeletedAMM.mockResolvedValue(null)

    renderRouter(DELETED_ACCOUNT)

    await waitFor(() => {
      expect(screen.getByTestId('accounts-page')).toBeInTheDocument()
    })
  })

  it('redirects to /amm/:id for a deleted AMM pool', async () => {
    const error = new RippledError('Account not found', 404)
    mockGetAccountInfo.mockRejectedValue(error)
    mockDetectDeletedAMM.mockResolvedValue({
      account: DELETED_AMM_ACCOUNT,
      asset: { currency: 'XRP' },
      asset2: {
        currency: '504958454C530000000000000000000000000000',
        issuer: 'rNEQb5e4DZUJG48xKPstDWjmm1PQ4fcUfZ',
      },
      lpToken: {
        currency: '0370963F20A61AF3C6E5D674EAAEE3E65C0BDC9F',
        issuer: DELETED_AMM_ACCOUNT,
        value: '2764439179.245265',
      },
      deletionDate: 827617760,
    })

    renderRouter(DELETED_AMM_ACCOUNT)

    await waitFor(() => {
      expect(mockDetectDeletedAMM).toHaveBeenCalled()
      // Navigate component redirects, so Accounts page should NOT render
      expect(screen.queryByTestId('accounts-page')).not.toBeInTheDocument()
    })
  })

  it('calls getDeletedAMMData only when account_info returns 404', async () => {
    mockGetAccountInfo.mockResolvedValue({
      Account: REGULAR_ACCOUNT,
      Balance: '1000000000',
    })

    renderRouter(REGULAR_ACCOUNT)

    await waitFor(() => {
      expect(screen.getByTestId('accounts-page')).toBeInTheDocument()
    })

    expect(mockDetectDeletedAMM).not.toHaveBeenCalled()
  })

  it('shows error for invalid account ID', async () => {
    renderRouter('not-a-valid-address')

    await waitFor(() => {
      // Should show NoMatch error for malformed address
      expect(screen.queryByTestId('accounts-page')).not.toBeInTheDocument()
    })
  })
})
