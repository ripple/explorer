import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { getToken } from '../../../rippled'
import getTokenHolders from '../../../rippled/holders'
import { getDexTrades, getTransfers } from '../../../rippled/tokenTx'
import { getAccountLines, getAMMInfo } from '../../../rippled/lib/rippled'
import SocketContext from '../../shared/SocketContext'
import { DROPS_TO_XRP_FACTOR } from '../../shared/utils'
import { DexTrade } from '../services/dexTradesPagination'

interface DexTradesData {
  trades: DexTrade[]
  totalTrades: number
  isLoading: boolean
}

interface UseTokenDataProps {
  currency: string
  accountId: string
  holdersPage: number
  holdersPageSize: number
  transfersPage: number
  transfersPageSize: number
  dexTradesPage: number
  dexTradesPageSize: number
  XRPUSDPrice: number
}

export const useTokenData = ({
  currency,
  accountId,
  holdersPage,
  holdersPageSize,
  transfersPage,
  transfersPageSize,
  dexTradesPage,
  dexTradesPageSize,
  XRPUSDPrice,
}: UseTokenDataProps) => {
  const rippledSocket = useContext(SocketContext)

  // State for dex trades (custom implementation)
  const [dexTradesData, setDexTradesData] = useState<DexTradesData>({
    trades: [],
    totalTrades: 0,
    isLoading: false,
  })

  // Token basic info
  const tokenQuery = useQuery({
    queryKey: ['token', currency, accountId],
    queryFn: () => getToken(currency, accountId),
  })

  // Token holders
  const holdersQuery = useQuery({
    queryKey: ['holders', currency, accountId, holdersPage],
    queryFn: () => {
      const offset = (holdersPage - 1) * holdersPageSize
      return getTokenHolders(currency, accountId, holdersPageSize, offset)
    },
  })

  // Transfers
  const transfersQuery = useQuery({
    queryKey: ['transfers', currency, accountId, transfersPage],
    queryFn: () => {
      const from = (transfersPage - 1) * transfersPageSize
      return getTransfers(currency, accountId, from, transfersPageSize)
    },
  })

  // AMM TVL calculation
  const fetchAmmInfo = () =>
    getAMMInfo(
      rippledSocket,
      { currency: 'XRP' },
      { currency, issuer: accountId },
    ).then(
      (data) =>
        (Number(data.amm.amount) / DROPS_TO_XRP_FACTOR) * XRPUSDPrice * 2,
    )

  const ammTvlQuery = useQuery({
    queryKey: ['ammTvl', currency, accountId],
    queryFn: fetchAmmInfo,
    enabled: !!XRPUSDPrice,
  })

  // Dex trades custom fetching
  useEffect(() => {
    const fetchDexTrades = async () => {
      if (!currency || !accountId) {
        return
      }

      setDexTradesData((prev) => ({ ...prev, isLoading: true }))

      try {
        const directResult = await getDexTrades(currency, accountId, 0, 10)

        const testTrades: DexTrade[] = []
        if (directResult && directResult.results) {
          directResult.results.forEach((transaction: any) => {
            if (
              transaction.dex_trades &&
              Array.isArray(transaction.dex_trades)
            ) {
              transaction.dex_trades.forEach((trade: any) => {
                testTrades.push({
                  hash: transaction.hash,
                  ledger: transaction.ledger_index,
                  timestamp: transaction.timestamp,
                  from: trade.from,
                  to: trade.to,
                  rate:
                    trade.amount_out && Number(trade.amount_out.value) !== 0
                      ? Number(trade.amount_in.value) /
                        Number(trade.amount_out.value)
                      : null,
                  amount_in: {
                    currency: trade.amount_in.currency,
                    issuer: trade.amount_in.issuer,
                    amount: Number(trade.amount_in.value),
                  },
                  amount_out: {
                    currency: trade.amount_out.currency,
                    issuer: trade.amount_out.issuer,
                    amount: Number(trade.amount_out.value),
                  },
                })
              })
            }
          })
        }

        setDexTradesData({
          trades: testTrades,
          totalTrades: directResult?.total || 0,
          isLoading: false,
        })
      } catch (error) {
        setDexTradesData({
          trades: [],
          totalTrades: 0,
          isLoading: false,
        })
      }
    }

    fetchDexTrades()
  }, [currency, accountId, dexTradesPage, dexTradesPageSize])

  return {
    token: {
      data: tokenQuery.data,
      isLoading: tokenQuery.isLoading,
      error: tokenQuery.error,
    },
    holders: {
      data: holdersQuery.data,
      isLoading: holdersQuery.isLoading,
      error: holdersQuery.error,
    },
    transfers: {
      data: transfersQuery.data,
      isLoading: transfersQuery.isLoading,
      error: transfersQuery.error,
    },
    ammTvl: {
      data: ammTvlQuery.data,
      isLoading: ammTvlQuery.isLoading,
      error: ammTvlQuery.error,
    },
    dexTrades: dexTradesData,
  }
}
