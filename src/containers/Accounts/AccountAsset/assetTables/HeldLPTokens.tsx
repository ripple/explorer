import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useEffect, useContext, useMemo } from 'react'
import { Loader } from '../../../shared/components/Loader'
import SocketContext from '../../../shared/SocketContext'
import Currency, {
  LP_TOKEN_IDENTIFIER,
} from '../../../shared/components/Currency'
import { Account } from '../../../shared/components/Account'
import {
  formatTokenBalance,
  formatUsdBalance,
} from '../../../shared/NumberFormattingUtils'
import { useLanguage } from '../../../shared/hooks'
import { shortenAccount } from '../../../shared/utils'

import {
  getBalances,
  getAMMInfoByAMMAccount,
} from '../../../../rippled/lib/rippled'
import { XRP_BASE } from '../../../shared/transactionUtils'
import { EmptyMessageTableRow } from '../../../shared/EmptyMessageTableRow'
import logger from '../../../../rippled/lib/logger'

const log = logger({ name: 'HeldLPTokens' })

const fetchAccountHeldLPTokens = async (rippledSocket, accountId) => {
  let balancesResponse
  try {
    balancesResponse = await getBalances(rippledSocket, accountId)
  } catch (error) {
    log.error(
      `Error calling gatewayBalances for account ${accountId}: ${JSON.stringify(error)}`,
    )
    return []
  }
  const lpTokens: any[] = []
  for (const [issuerAccount, assets] of Object.entries(
    balancesResponse?.assets ?? {},
  )) {
    for (const asset of assets as any[]) {
      if (asset.currency && asset.currency.startsWith(LP_TOKEN_IDENTIFIER)) {
        // eslint-disable-next-line no-await-in-loop
        const result = await processLPTokenAsset(
          rippledSocket,
          issuerAccount,
          asset,
        )

        // The currency code of an IOU could start with `LP_TOKEN_IDENTIFIER` as well,
        // but `result` will be null since getAMMInfoByAMMAccount will throw an exception
        if (result) {
          lpTokens.push(result)
        }
      }
    }
  }

  return lpTokens
}

const processLPTokenAsset = async (rippledSocket, issuerAccount, asset) => {
  let ammInfoResponse
  try {
    ammInfoResponse = await getAMMInfoByAMMAccount(rippledSocket, issuerAccount)
  } catch (error) {
    log.error(`Error fetching AMM pool: ${JSON.stringify(error)}`)
    return null
  }

  if (!ammInfoResponse.amm) {
    return null
  }

  const ammData = ammInfoResponse.amm

  // Calculate share percentage
  const accountLPTokenBalance = parseFloat(asset.value)
  const ammLPTokenBalance = parseFloat(ammData.lp_token?.value || 0)
  const sharePercentage =
    ammLPTokenBalance > 0
      ? (100 * accountLPTokenBalance) / ammLPTokenBalance
      : 0

  const isAmount1XRP = typeof ammData.amount === 'string'
  const isAmount2XRP = typeof ammData.amount2 === 'string'

  // Calculate LP Token price in XRP only when one of the assets is XRP
  let lpTokenPriceInXRP = 0
  if (isAmount1XRP || isAmount2XRP) {
    const xrpAmount = isAmount1XRP
      ? parseFloat(ammData.amount) / XRP_BASE
      : parseFloat(ammData.amount2) / XRP_BASE

    if (ammLPTokenBalance > 0 && xrpAmount > 0) {
      // Price per LP token = (XRP in pool * 2) / total LP tokens
      // We multiply by 2 because LP token represents share of both assets
      lpTokenPriceInXRP = (xrpAmount * 2) / ammLPTokenBalance
    }
  }

  let currency1
  let currency2
  if (isAmount1XRP && !isAmount2XRP) {
    currency1 = 'XRP'
    currency2 = ammData.amount2.currency
  } else if (!isAmount1XRP && isAmount2XRP) {
    currency1 = 'XRP'
    currency2 = ammData.amount.currency
  } else {
    // Both are tokens (no XRP)
    currency1 = ammData.amount.currency
    currency2 = ammData.amount2.currency
  }

  return {
    ammInstance: issuerAccount,
    currency1,
    currency2,
    lpTokenBalance: accountLPTokenBalance,
    lpTokenPriceInXRP,
    share: sharePercentage,
  }
}

interface HeldLPTokensProps {
  accountId: string
  xrpToUSDRate: number
  onChange?: (data: { count: number; isLoading: boolean }) => void
}

export const HeldLPTokens = ({
  accountId,
  xrpToUSDRate,
  onChange,
}: HeldLPTokensProps) => {
  const lang = useLanguage()
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)

  const heldLPTokensQuery = useQuery(['heldLPTokens', accountId], () =>
    fetchAccountHeldLPTokens(rippledSocket, accountId),
  )

  const lpTokenData = useMemo(
    () => heldLPTokensQuery.data ?? [],
    [heldLPTokensQuery.data],
  )

  // Two-tier sort: 1) XRP pairs first, 2) within XRP pairs, sort by USD value descending
  const rows = lpTokenData.sort((a, b) => {
    const aHasXRP = a.currency1 === 'XRP' || a.currency2 === 'XRP'
    const bHasXRP = b.currency1 === 'XRP' || b.currency2 === 'XRP'

    // First, prioritize XRP pairs
    if (aHasXRP && !bHasXRP) {
      return -1
    }
    if (!aHasXRP && bHasXRP) {
      return 1
    }

    // Then sort by Balance USD descending (only for XRP pairs)
    if (aHasXRP && bHasXRP) {
      const aBalanceUSD = a.lpTokenBalance * a.lpTokenPriceInXRP * xrpToUSDRate
      const bBalanceUSD = b.lpTokenBalance * b.lpTokenPriceInXRP * xrpToUSDRate
      return bBalanceUSD - aBalanceUSD
    }

    // For non-XRP pairs, maintain original order
    return 0
  })

  // Communicate count and loading state back to parent
  useEffect(() => {
    if (onChange) {
      onChange({ count: rows.length, isLoading: heldLPTokensQuery.isLoading })
    }
  }, [rows.length, heldLPTokensQuery.isLoading, onChange])

  if (heldLPTokensQuery.isLoading) {
    return <Loader />
  }

  const cols = [
    t('account_page_asset_table_column_amm_instance'),
    t('account_page_asset_table_column_amm_pair'),
    t('account_page_asset_table_column_balance'),
    t('account_page_asset_table_column_balance_usd'),
    t('account_page_asset_table_column_share'),
  ]
  return (
    <div className="account-asset-table">
      <table>
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <EmptyMessageTableRow colSpan={cols.length}>
              {t('account_page_asset_table_no_lptoken')}
            </EmptyMessageTableRow>
          ) : (
            rows.map((row) => {
              // Calculate display values using utility functions
              const formattedBalance = formatTokenBalance(
                row.lpTokenBalance,
                lang,
              )

              // Format USD Balance (only for XRP pairs)
              let formattedBalanceUsd = '--'
              if (row.currency1 === 'XRP' || row.currency2 === 'XRP') {
                const balanceUSD =
                  row.lpTokenBalance * row.lpTokenPriceInXRP * xrpToUSDRate
                formattedBalanceUsd = formatUsdBalance(balanceUSD, lang)
              }

              return (
                <tr key={`${row.ammInstance}`}>
                  <td>
                    <Account
                      account={row.ammInstance}
                      displayText={shortenAccount(row.ammInstance)}
                    />
                  </td>
                  <td>
                    <Currency
                      currency={row.currency1}
                      displaySymbol={false}
                      link={false}
                    />
                    /
                    <Currency
                      currency={row.currency2}
                      displaySymbol={false}
                      link={false}
                    />
                  </td>
                  <td>{formattedBalance}</td>
                  <td>{formattedBalanceUsd}</td>
                  <td>
                    {row.share < 1
                      ? row.share.toFixed(4)
                      : row.share.toFixed(2)}
                    %
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
