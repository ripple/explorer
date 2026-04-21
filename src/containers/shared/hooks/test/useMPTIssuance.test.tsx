import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import SocketContext from '../../SocketContext'
import { useMPTIssuance } from '../useMPTIssuance'
import { getMPTIssuance } from '../../../../rippled/lib/rippled'
import { formatMPTIssuance } from '../../../../rippled/lib/utils'
import { useAnalytics } from '../../analytics'
import { FormattedMPTIssuance } from '../../Interfaces'

jest.mock('../../../../rippled/lib/rippled', () => ({
  getMPTIssuance: jest.fn(),
}))
jest.mock('../../../../rippled/lib/utils', () => ({
  formatMPTIssuance: jest.fn(),
}))
jest.mock('../../analytics', () => ({
  useAnalytics: jest.fn(),
}))

const mockGetMPTIssuance = getMPTIssuance as jest.Mock
const mockFormatMPTIssuance = formatMPTIssuance as jest.Mock
const mockUseAnalytics = useAnalytics as jest.Mock
const mockSocket = {} as any

const MPT_ID = '00000001ABC123'

const formatted: FormattedMPTIssuance = {
  issuer: 'rIssuer',
  sequence: 1,
  isMPTMetadataCompliant: true,
}

const createWrapper =
  (
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: 0 } },
    }),
  ) =>
  ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <SocketContext.Provider value={mockSocket}>
        {children}
      </SocketContext.Provider>
    </QueryClientProvider>
  )

describe('useMPTIssuance', () => {
  const trackException = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAnalytics.mockReturnValue({ trackException })
    mockFormatMPTIssuance.mockReturnValue(formatted)
  })

  it('fetches and returns formatted MPT issuance data', async () => {
    mockGetMPTIssuance.mockResolvedValueOnce({ node: { foo: 'bar' } })

    const { result } = renderHook(() => useMPTIssuance(MPT_ID), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetMPTIssuance).toHaveBeenCalledWith(mockSocket, MPT_ID)
    expect(mockFormatMPTIssuance).toHaveBeenCalledWith({ foo: 'bar' })
    expect(result.current.data).toEqual(formatted)
  })

  it('does not fire the query when mptID is null', () => {
    const { result } = renderHook(() => useMPTIssuance(null), {
      wrapper: createWrapper(),
    })

    expect(mockGetMPTIssuance).not.toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
  })

  it('does not fire the query when mptID is undefined', () => {
    const { result } = renderHook(() => useMPTIssuance(undefined), {
      wrapper: createWrapper(),
    })

    expect(mockGetMPTIssuance).not.toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
  })

  it('does not fire the query when enabled is false, even with a valid mptID', () => {
    const { result } = renderHook(() => useMPTIssuance(MPT_ID, false), {
      wrapper: createWrapper(),
    })

    expect(mockGetMPTIssuance).not.toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
  })

  it('calls trackException when the query fails', async () => {
    mockGetMPTIssuance.mockRejectedValueOnce(new Error('boom'))

    const { result } = renderHook(() => useMPTIssuance(MPT_ID), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(trackException).toHaveBeenCalledTimes(1)
    const message = trackException.mock.calls[0][0] as string
    expect(message).toContain(`Error fetching mptIssuanceID metadata ${MPT_ID}`)
  })
})
