import { act, render, screen } from '@testing-library/react'
import { Route } from 'react-router'
import i18n from '../../../../i18n/testConfig'
import { QuickHarness } from '../../../test/utils'
import { TOKEN_ROUTE } from '../../../App/routes'
import { IOU } from '../index'
import getToken from '../api/token'

jest.mock('../api/token', () => ({
  __esModule: true,
  ...jest.requireActual('../api/token'),
  default: jest.fn(),
}))

jest.mock('../api/holders', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('../../../../rippled/lib/rippled', () => ({
  getAMMInfoByAssets: jest.fn().mockRejectedValue(new Error('no amm')),
}))

jest.mock('../../../shared/hooks/useCursorPaginatedQuery', () => ({
  useCursorPaginatedQuery: () => ({
    data: undefined,
    isLoading: false,
    page: 1,
    setPage: jest.fn(),
    sortField: 'timestamp',
    setSortField: jest.fn(),
    sortOrder: 'desc',
    setSortOrder: jest.fn(),
    refresh: jest.fn(),
  }),
}))

jest.mock('../../../shared/hooks/useXRPToUSDRate', () => ({
  useXRPToUSDRate: () => 0,
}))

jest.mock('../Header', () => ({
  Header: ({ tokenData, isTokenDataUnavailable }: any) => (
    <div data-testid="header">
      {tokenData.currency}.{tokenData.issuer_account}
      {isTokenDataUnavailable ? ' unavailable' : ` price ${tokenData.price}`}
    </div>
  ),
}))

jest.mock('../TablePicker', () => ({
  TablePicker: () => <div data-testid="table-picker" />,
}))

const mockGetToken = getToken as jest.Mock
const ISSUER = 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De'

const httpError = (status: number) =>
  Object.assign(new Error(`status ${status}`), {
    isAxiosError: true,
    response: { status },
  })

const renderPage = () =>
  render(
    <QuickHarness i18n={i18n} initialEntries={[`/token/USD.${ISSUER}`]}>
      <Route path={TOKEN_ROUTE.path} element={<IOU />} />
    </QuickHarness>,
  )

// Lets pending promises settle, then advances past react-query's backoff.
const flush = async (ms = 0) => {
  await act(async () => {
    jest.advanceTimersByTime(ms)
    await Promise.resolve()
  })
}

describe('IOU container', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockGetToken.mockReset()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('retries a throttled token request and then renders the token', async () => {
    mockGetToken.mockRejectedValueOnce(httpError(429)).mockResolvedValueOnce({
      currency: 'USD',
      issuer_account: ISSUER,
      price: '0.5',
      index: 0,
    })

    renderPage()
    await flush()
    expect(mockGetToken).toHaveBeenCalledTimes(1)
    await flush(1000)
    await flush()

    expect(mockGetToken).toHaveBeenCalledTimes(2)
    expect(screen.getByTestId('header')).toHaveTextContent(
      `USD.${ISSUER} price 0.5`,
    )
    expect(screen.getByTestId('table-picker')).toBeInTheDocument()
  })

  it('still renders the page when token details keep failing', async () => {
    mockGetToken.mockRejectedValue(httpError(429))

    renderPage()
    for (let i = 0; i < 4; i += 1) {
      // eslint-disable-next-line no-await-in-loop -- steps through each backoff in order
      await flush(10000)
    }

    expect(mockGetToken).toHaveBeenCalledTimes(4)
    expect(screen.getByTestId('header')).toHaveTextContent(
      `USD.${ISSUER} unavailable`,
    )
    expect(screen.getByTestId('table-picker')).toBeInTheDocument()
  })

  it('shows the error page for a token LOS does not know', async () => {
    mockGetToken.mockRejectedValue(httpError(404))

    renderPage()
    await flush()
    await flush()

    expect(mockGetToken).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('header')).not.toBeInTheDocument()
    expect(screen.queryByTestId('table-picker')).not.toBeInTheDocument()
    expect(screen.getByText('generic_error')).toBeInTheDocument()
  })
})
