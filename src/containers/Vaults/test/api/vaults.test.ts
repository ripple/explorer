import axios from 'axios'
import {
  fetchVaultsList,
  fetchVaultsAggregateStats,
  fetchVaultAssetPrices,
} from '../../api'

jest.mock('axios')

describe('Vaults API', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchVaultsList', () => {
    const mockApiResponse = {
      total: 2,
      page: 1,
      size: 20,
      sort_by: 'assets_total',
      sort_order: 'desc',
      asset_type: 'all',
      results: [
        {
          vault_id: 'vault123',
          name: 'Test Vault',
          asset_currency: 'XRP',
          asset_issuer: '',
          asset_issuer_name: '',
          assets_total: 5000000,
          outstanding_loans: 2500000,
          utilization_ratio: 0.5,
          average_interest_rate: 5.25,
          website: 'https://example.com',
          asset_category: 'xrp',
        },
      ],
    }

    it('should fetch and map vault data correctly', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockApiResponse })

      const result = await fetchVaultsList({
        page: 1,
        size: 20,
        sortField: 'tvl-usd',
        sortOrder: 'desc',
        assetType: '',
        searchQuery: '',
      })

      expect(result.total).toBe(2)
      expect(result.results).toHaveLength(1)
      // Verify field mapping from API names to frontend names
      expect(result.results[0].vault_id).toBe('vault123')
      expect(result.results[0].name).toBe('Test Vault')
      expect(result.results[0].tvl_usd).toBe(5000000)
      expect(result.results[0].outstanding_loans_usd).toBe(2500000)
      expect(result.results[0].avg_interest_rate).toBe(5.25)
      expect(result.results[0].utilization_ratio).toBe(0.5)
    })

    it('should map sort field names to API parameters', async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: { ...mockApiResponse, results: [] },
      })

      await fetchVaultsList({
        page: 1,
        size: 20,
        sortField: 'tvl-usd',
        sortOrder: 'desc',
        assetType: '',
        searchQuery: '',
      })

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('sort_by=assets_total'),
      )
    })

    it('should map outstanding-loans-usd sort field', async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: { ...mockApiResponse, results: [] },
      })

      await fetchVaultsList({
        page: 1,
        size: 20,
        sortField: 'outstanding-loans-usd',
        sortOrder: 'asc',
        assetType: '',
        searchQuery: '',
      })

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('sort_by=outstanding_loans'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('sort_order=asc'),
      )
    })

    it('should include asset_type param for non-default filters', async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: { ...mockApiResponse, results: [] },
      })

      await fetchVaultsList({
        page: 1,
        size: 20,
        sortField: 'tvl-usd',
        sortOrder: 'desc',
        assetType: 'stablecoin',
        searchQuery: '',
      })

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('asset_type=stablecoins'),
      )
    })

    it('should not include asset_type for "all" filter', async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: { ...mockApiResponse, results: [] },
      })

      await fetchVaultsList({
        page: 1,
        size: 20,
        sortField: 'tvl-usd',
        sortOrder: 'desc',
        assetType: '',
        searchQuery: '',
      })

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.not.stringContaining('asset_type='),
      )
    })

    it('should include name_like param for search queries', async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: { ...mockApiResponse, results: [] },
      })

      await fetchVaultsList({
        page: 1,
        size: 20,
        sortField: 'tvl-usd',
        sortOrder: 'desc',
        assetType: '',
        searchQuery: 'lending',
      })

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('name_like=lending'),
      )
    })

    it('should trim whitespace from search queries', async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: { ...mockApiResponse, results: [] },
      })

      await fetchVaultsList({
        page: 1,
        size: 20,
        sortField: 'tvl-usd',
        sortOrder: 'desc',
        assetType: '',
        searchQuery: '  vault  ',
      })

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('name_like=vault'),
      )
    })

    it('should not include name_like for empty search', async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: { ...mockApiResponse, results: [] },
      })

      await fetchVaultsList({
        page: 1,
        size: 20,
        sortField: 'tvl-usd',
        sortOrder: 'desc',
        assetType: '',
        searchQuery: '   ',
      })

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.not.stringContaining('name_like'),
      )
    })

    it('should include page and size params', async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: { ...mockApiResponse, results: [] },
      })

      await fetchVaultsList({
        page: 3,
        size: 10,
        sortField: 'tvl-usd',
        sortOrder: 'desc',
        assetType: '',
        searchQuery: '',
      })

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('page=3'),
      )
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('size=10'),
      )
    })

    it('should handle empty results array', async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: { ...mockApiResponse, total: 0, results: [] },
      })

      const result = await fetchVaultsList({
        page: 1,
        size: 20,
        sortField: 'tvl-usd',
        sortOrder: 'desc',
        assetType: '',
        searchQuery: '',
      })

      expect(result.total).toBe(0)
      expect(result.results).toHaveLength(0)
    })

    it('should propagate network errors', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Network error'))

      await expect(
        fetchVaultsList({
          page: 1,
          size: 20,
          sortField: 'tvl-usd',
          sortOrder: 'desc',
          assetType: '',
          searchQuery: '',
        }),
      ).rejects.toThrow('Network error')
    })
  })

  describe('fetchVaultsAggregateStats', () => {
    const mockStatsResponse = {
      tvl_total: 8000000,
      debt_total: 3700000,
      active_vaults: 42,
      avg_interest_rate: 4.5,
      utilization_ratio: 0.4625,
      loans_originated: 15000000,
      last_updated: '2026-03-17T00:00:00Z',
    }

    it('should fetch aggregate stats successfully', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockStatsResponse })

      const result = await fetchVaultsAggregateStats()

      expect(result).toEqual(mockStatsResponse)
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/v1/vaults/aggregate-statistics',
      )
    })

    it('should return all expected fields', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockStatsResponse })

      const result = await fetchVaultsAggregateStats()

      expect(result).toHaveProperty('tvl_total')
      expect(result).toHaveProperty('debt_total')
      expect(result).toHaveProperty('active_vaults')
      expect(result).toHaveProperty('avg_interest_rate')
      expect(result).toHaveProperty('utilization_ratio')
      expect(result).toHaveProperty('loans_originated')
    })

    it('should propagate network errors', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Server error'))

      await expect(fetchVaultsAggregateStats()).rejects.toThrow('Server error')
    })
  })

  describe('fetchVaultAssetPrices', () => {
    const mockPricesResponse = {
      prices: {
        'USD.rIssuer123': 0.35,
        'EUR.rIssuer456': 0.38,
      },
      lastUpdated: 1710000000000,
    }

    it('should fetch asset prices successfully', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockPricesResponse })

      const result = await fetchVaultAssetPrices()

      expect(result).toEqual(mockPricesResponse)
      expect(mockAxios.get).toHaveBeenCalledWith('/api/v1/vaults/asset-prices')
    })

    it('should return prices map and lastUpdated', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockPricesResponse })

      const result = await fetchVaultAssetPrices()

      expect(result).toHaveProperty('prices')
      expect(result).toHaveProperty('lastUpdated')
      expect(result.prices['USD.rIssuer123']).toBe(0.35)
    })

    it('should propagate network errors', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Server error'))

      await expect(fetchVaultAssetPrices()).rejects.toThrow('Server error')
    })
  })
})
