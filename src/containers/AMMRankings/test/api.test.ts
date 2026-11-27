import axios from 'axios'
import { fetchHistoricalTrends, fetchAMMHistoricalTrends } from '../api'

jest.mock('axios')

describe('AMMRankings historical trends API', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>

  beforeEach(() => {
    jest.clearAllMocks()
    mockAxios.get.mockResolvedValue({ data: { data_points: [] } })
  })

  const paramsOfLastCall = () => mockAxios.get.mock.calls[0][1]?.params

  // The rankings page list and stat tiles are scoped to XRP pools by the explorer server. This
  // route is generic over amm_account_id, so the flag has to be sent explicitly — without it
  // the chart silently plots the all-pools series beside XRP-only tiles.
  it('requests the XRP-only series for the aggregate chart', async () => {
    await fetchHistoricalTrends('6M')

    expect(paramsOfLastCall()).toMatchObject({
      amm_account_id: 'aggregated',
      time_range: '6M',
      xrp_only: true,
    })
  })

  // A single pool's series is already pool-scoped, and LOS ignores xrp_only when
  // amm_account_id names a specific pool.
  it('does not send xrp_only for a single pool series', async () => {
    await fetchAMMHistoricalTrends('rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG', '1M')

    expect(paramsOfLastCall()).not.toHaveProperty('xrp_only')
  })
})
