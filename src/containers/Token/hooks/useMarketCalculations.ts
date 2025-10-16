import { useMemo } from 'react'
import { formatPrice } from '../../shared/utils'
import { TokenHoldersData } from '../api/holders'
import { LOSToken } from '../../shared/losTypes'
import {
  formatCirculatingSupply,
  calculateCirculatingSupply,
} from '../utils/tokenCalculations'

interface MarketCalculations {
  marketCap: string | null
  circSupply: number
  formattedCircSupply: string
}

interface UseMarketCalculationsProps {
  holdersData: TokenHoldersData | undefined
  tokenData: LOSToken
  price: string
  xrpUSDRate: string
  isHoldersDataLoading: boolean
}

export const useMarketCalculations = ({
  holdersData,
  tokenData,
  price,
  xrpUSDRate,
  isHoldersDataLoading,
}: UseMarketCalculationsProps): MarketCalculations =>
  useMemo(() => {
    const circSupply = calculateCirculatingSupply(holdersData, tokenData)

    const marketCap =
      !isHoldersDataLoading && circSupply && price && xrpUSDRate
        ? formatPrice(
            Number(circSupply) * Number(price) * Number(xrpUSDRate),
          ) || null
        : null

    const formattedCircSupply = formatCirculatingSupply(circSupply)

    return {
      marketCap,
      circSupply,
      formattedCircSupply,
    }
  }, [holdersData, tokenData, price, xrpUSDRate, isHoldersDataLoading])
