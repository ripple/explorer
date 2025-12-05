import axios from 'axios'
import getToken from '../../api/token'
import { LOSToken } from '../../../shared/losTypes'

jest.mock('axios')

describe('Token API', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getToken', () => {
    const mockResponse: LOSToken = {
      currency: 'USD',
      issuer_account: 'rIssuer123',
      name: 'US Dollar',
      asset_class: 'currency',
      asset_subclass: 'stablecoin',
      daily_trades: '1000',
      icon: 'https://example.com/icon.png',
      ttl: 3600,
      social_links: [],
      trustlines: 5000,
      transfer_fee: 0.5,
      issuer_domain: 'https://example.com',
      issuer_name: 'Example Issuer',
      market_cap: '1000000',
      market_cap_usd: '1000000',
      holders: 500,
      daily_volume: '50000',
      supply: '1000000',
      trust_level: 1,
      price: '1.00',
      tvl_usd: '100000',
      index: 0,
      circ_supply: '800000',
    }

    it('should fetch token data successfully', async () => {
      const apiResponse = {
        currency: 'USD',
        issuer_account: 'rIssuer123',
        token_name: 'US Dollar',
        asset_class: 'currency',
        asset_subclass: 'stablecoin',
        number_of_trades: 1000,
        icon: 'https://example.com/icon.png',
        ttl: 3600,
        social_links: [],
        number_of_trustlines: 5000,
        transfer_fee: 0.5,
        issuer_domain: 'https://example.com',
        issuer_name: 'Example Issuer',
        market_cap: '1000000',
        market_cap_usd: '1000000',
        number_of_holders: 500,
        daily_volume: '50000',
        supply: '1000000',
        trust_level: 1,
        price: '1.00',
        tvl_usd: '100000',
        index: 0,
        circ_supply: '800000',
      }
      mockAxios.get.mockResolvedValueOnce({ data: apiResponse })

      const result = await getToken('USD', 'rIssuer123')

      expect(result).toEqual(mockResponse)
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/tokens/USD.rIssuer123'),
      )
    })

    it('should map response data correctly', async () => {
      const apiResponse = {
        currency: 'EUR',
        issuer_account: 'rEURIssuer',
        token_name: 'Euro',
        asset_class: 'currency',
        asset_subclass: 'fiat',
        number_of_trades: 500,
        icon: 'https://example.com/eur.png',
        ttl: 7200,
        social_links: ['https://twitter.com/example'],
        number_of_trustlines: 2000,
        transfer_fee: 0.25,
        issuer_domain: 'https://euro.example.com',
        issuer_name: 'Euro Issuer',
        market_cap: '500000',
        market_cap_usd: '500000',
        number_of_holders: 250,
        daily_volume: '25000',
        supply: '500000',
        trust_level: 1,
        price: '1.10',
        tvl_usd: '50000',
        circ_supply: '400000',
      }

      mockAxios.get.mockResolvedValueOnce({ data: apiResponse })

      const result = await getToken('EUR', 'rEURIssuer')

      expect(result.currency).toBe('EUR')
      expect(result.issuer_account).toBe('rEURIssuer')
      expect(result.name).toBe('Euro')
      expect(result.holders).toBe(250)
      expect(result.trustlines).toBe(2000)
    })

    it('should handle missing optional fields', async () => {
      const minimalResponse = {
        currency: 'TEST',
        issuer_account: 'rTest',
        token_name: 'Test Token',
        asset_class: 'token',
      }

      mockAxios.get.mockResolvedValueOnce({ data: minimalResponse })

      const result = await getToken('TEST', 'rTest')

      expect(result.currency).toBe('TEST')
      expect(result.index).toBe(-1)
    })

    it('should throw error on API failure', async () => {
      const error = new Error('Network error')
      mockAxios.get.mockRejectedValueOnce(error)

      await expect(getToken('USD', 'rIssuer123')).rejects.toThrow(
        'Network error',
      )
    })

    it('should throw error on 404 response', async () => {
      const error = new Error('Not found')
      mockAxios.get.mockRejectedValueOnce(error)

      await expect(getToken('INVALID', 'rInvalid')).rejects.toThrow()
    })

    it('should construct correct URL with currency and issuer', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockResponse })

      await getToken('XRP', 'rXRPIssuer')

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('XRP.rXRPIssuer'),
      )
    })

    it('should handle response with all optional fields', async () => {
      const fullResponse = {
        currency: 'FULL',
        issuer_account: 'rFull',
        token_name: 'Full Token',
        asset_class: 'token',
        asset_subclass: 'utility',
        number_of_trades: 5000,
        icon: 'https://example.com/full.png',
        ttl: 86400,
        social_links: ['https://twitter.com/full', 'https://discord.gg/full'],
        number_of_trustlines: 10000,
        transfer_fee: 1.5,
        issuer_domain: 'https://full.example.com',
        issuer_name: 'Full Issuer',
        market_cap: '5000000',
        market_cap_usd: '5000000',
        number_of_holders: 5000,
        daily_volume: '500000',
        supply: '5000000',
        trust_level: 1,
        price: '1.50',
        tvl_usd: '1000000',
        index: 1,
        circ_supply: '4000000',
      }

      mockAxios.get.mockResolvedValueOnce({ data: fullResponse })

      const result = await getToken('FULL', 'rFull')

      expect(result.currency).toBe('FULL')
      expect(result.name).toBe('Full Token')
      expect(result.social_links).toEqual([
        'https://twitter.com/full',
        'https://discord.gg/full',
      ])
      expect(result.index).toBe(1)
    })

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded')
      mockAxios.get.mockRejectedValueOnce(timeoutError)

      await expect(getToken('USD', 'rIssuer123')).rejects.toThrow('timeout')
    })

    it('should handle server errors', async () => {
      const serverError = new Error('500 Internal Server Error')
      mockAxios.get.mockRejectedValueOnce(serverError)

      await expect(getToken('USD', 'rIssuer123')).rejects.toThrow()
    })
  })
})
