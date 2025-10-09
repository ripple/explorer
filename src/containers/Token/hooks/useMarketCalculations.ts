import { useMemo } from 'react'
import { formatPrice } from '../../shared/utils'
import { TokenHoldersData } from '../../../rippled/holders'
import { LOSToken } from '../../shared/losTypes'
import { formatCirculatingSupply } from '../utils/tokenCalculations'

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
}: UseMarketCalculationsProps): MarketCalculations => {
  return useMemo(() => {
    const circSupply = holdersData?.totalSupply || Number(tokenData.supply) || 0

    const marketCap =
      !isHoldersDataLoading && circSupply && price && xrpUSDRate
        ? formatPrice(Number(circSupply) * Number(price) * Number(xrpUSDRate))
        : null

    const formattedCircSupply = formatCirculatingSupply(circSupply)

    return {
      marketCap,
      circSupply,
      formattedCircSupply,
    }
  }, [holdersData, tokenData.supply, price, xrpUSDRate, isHoldersDataLoading])
}
