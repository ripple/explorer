import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useEffect, useContext, useState, useCallback, useMemo } from 'react'
import Currency, {
  LP_TOKEN_IDENTIFIER,
} from '../../../shared/components/Currency'
import { Loader } from '../../../shared/components/Loader'
import { Account } from '../../../shared/components/Account'
import {
  ACCOUNT_FLAGS,
  buildFlags,
  formatTransferFee,
} from '../../../../rippled/lib/utils'
import { EmptyMessageTableRow } from '../../../shared/EmptyMessageTableRow'
import { RouteLink } from '../../../shared/routing'
import { TOKEN_ROUTE } from '../../../App/routes'
import SocketContext from '../../../shared/SocketContext'
import { shortenAccount } from '../../../shared/utils'
import {
  getBalances,
  getAccountLines,
  getAccountInfo,
} from '../../../../rippled/lib/rippled'
import logger from '../../../../rippled/lib/logger'
import DefaultTokenIcon from '../../../shared/images/default_token_icon.svg'

import { useLanguage } from '../../../shared/hooks'
import { calculateFormattedUsdBalance } from '../../../shared/NumberFormattingUtils'

const log = logger({ name: 'HeldIOUs' })

// The LOS Token API has a batch size limit of 100; larger requests will be rejected.
const LOS_TOKEN_API_BATCH_SIZE = 100

interface HeldIOUsProps {
  accountId: string
  onChange?: (data: { count: number; isLoading: boolean }) => void
}

interface IOU {
  tokenCode: string
  tokenIcon?: string
  issuer: string
  issuerName: string
  balance: number
  priceInUSD: number
  assetClass: string
  transferFee?: string
  frozen?: string
}

const fetchAccountHeldIOUs = async (
  rippledSocket: any,
  accountId: string,
): Promise<IOU[]> => {
  let balancesResponse
  try {
    balancesResponse = await getBalances(rippledSocket, accountId)
  } catch (error) {
    log.error(
      `Error calling 'gatewayBalances' for account ${accountId}: ${JSON.stringify(error)}`,
    )
    return []
  }

  // Collect all tokens, whether they are LP Tokens or IOUs
  const assetTokens: any[] = []
  for (const assets of Object.values(balancesResponse?.assets ?? {})) {
    for (const asset of assets as any[]) {
      if (asset.currency) {
        assetTokens.push(asset.currency)
      }
    }
  }
  if (assetTokens.length === 0) {
    // No tokens held, return empty array
    return []
  }

  // Get all trust lines using account_lines with pagination
  const allTrustLines: any[] = []
  let marker = ''
  do {
    try {
      // eslint-disable-next-line no-await-in-loop
      const accountLinesResponse = await getAccountLines(
        rippledSocket,
        accountId,
        400,
        marker,
      )

      if (accountLinesResponse?.lines) {
        allTrustLines.push(...accountLinesResponse.lines)
      }

      marker = accountLinesResponse?.marker || ''
    } catch (error) {
      log.error(
        `Error fetching account lines for account ${accountId}: ${JSON.stringify(error)}`,
      )
      // Break the loop on error to avoid infinite retry
      break
    }
  } while (marker)

  // Keep positive balances only (no LP token filtering at this stage)
  const positiveBalanceLines = allTrustLines.filter(
    (line: any) => parseFloat(line.balance) > 0,
  )

  if (positiveBalanceLines.length === 0) {
    return []
  }

  // Batch get token data from LOS Token API
  const allTokenIds = positiveBalanceLines.map(
    (line: any) => `${line.currency}.${line.account}`,
  )
  let allTokensFromLOS: Record<string, any> = {}
  for (let i = 0; i < allTokenIds.length; i += LOS_TOKEN_API_BATCH_SIZE) {
    const tokenIds = allTokenIds.slice(i, i + LOS_TOKEN_API_BATCH_SIZE)
    try {
      // eslint-disable-next-line no-await-in-loop
      const apiResponse = await fetch(
        `${process.env.VITE_LOS_URL}/tokens/batch-get`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenIds }),
        },
      )

      if (apiResponse.ok) {
        // eslint-disable-next-line no-await-in-loop
        const responseBody = await apiResponse.json()
        const tokensFromLOS =
          responseBody.tokens?.reduce((acc: any, token: any) => {
            acc[`${token.currency}.${token.issuer_account}`] = {
              ...token,
            }
            return acc
          }, {}) || {}
        allTokensFromLOS = { ...allTokensFromLOS, ...tokensFromLOS }
      }
    } catch (error) {
      log.error(
        `Error batch-get tokens[${tokenIds.join(', ')}]. Error: ${JSON.stringify(error)}`,
      )
    }
  }

  // Combine all data (without transfer fees and Global freeze status for now)
  const tokens: IOU[] = positiveBalanceLines.map((line: any) => {
    const tokenId = `${line.currency}.${line.account}`
    const token = allTokensFromLOS[tokenId]

    return {
      tokenCode: line.currency,
      tokenIcon: token?.icon,
      issuer: line.account,
      issuerName: token?.issuer_name,
      balance: parseFloat(line.balance),
      priceInUSD: token?.price_usd ? parseFloat(token.price_usd) : 0,
      assetClass: token?.asset_class || '--',
      transferFee: '--',
      frozen: line.freeze || line.freeze_peer ? 'Trustline' : '--',
    }
  })

  return tokens
}

/**
 * Held IOUs rendering flow:
 * 1. Initially display all tokens whose currency codes don't start with `03` (since `03` may indicate LP tokens).
 * 2. After confirming a `03` token is not an LP token, add it to the table.
 * 3. Progressively enrich each token row with transfer fee and account-level freeze status as that data loads.
 */
export const HeldIOUs = ({ accountId, onChange }: HeldIOUsProps) => {
  const lang = useLanguage()
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)

  const [progressiveUpdates, setProgressiveUpdates] = useState<
    Record<string, { transferFee: string; accountGlobalFrozen: boolean }>
  >({})
  const [confirmedNonLPTokens, setConfirmedNonLPTokens] = useState<Set<string>>(
    new Set(),
  )
  const [lpTokenCheckComplete, setLpTokenCheckComplete] = useState(false)

  const heldIOUsQuery = useQuery(['heldIOUs', accountId], () =>
    fetchAccountHeldIOUs(rippledSocket, accountId),
  )

  // Filter out ALL '03' tokens initially, then add back confirmed non-LP tokens
  const sortedIOUs = useMemo(() => {
    const data = heldIOUsQuery.data || []
    const filteredData = data.filter((token) => {
      // If it starts with '03', only include if confirmed as non-LP
      if (token.tokenCode.startsWith(LP_TOKEN_IDENTIFIER)) {
        return confirmedNonLPTokens.has(token.tokenCode)
      }
      // Include all non-'03' tokens
      return true
    })

    return [...filteredData].sort(
      (a, b) => b.priceInUSD * b.balance - a.priceInUSD * a.balance,
    )
  }, [heldIOUsQuery.data, confirmedNonLPTokens])

  // Apply progressive updates to the base IOU token data
  const iouTokens = sortedIOUs.map((token) => {
    const progressiveUpdate = progressiveUpdates[token.issuer]
    return {
      ...token,
      transferFee: progressiveUpdate?.transferFee || token.transferFee,
      frozen: progressiveUpdate?.accountGlobalFrozen ? 'Global' : token.frozen,
    }
  })

  // Progressive fetching of account info with transfer fee and Global freeze status
  const fetchAccountInfoProgressively = useCallback(async () => {
    if (sortedIOUs.length === 0) {
      return
    }

    const uniqueIssuers = [...new Set(sortedIOUs.map((line) => line.issuer))]
    for (const issuer of uniqueIssuers) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const accountInfo = await getAccountInfo(rippledSocket, issuer, false)

        const transferFee = formatTransferFee(accountInfo?.TransferRate, 'IOU')

        const accountGlobalFrozen = buildFlags(
          accountInfo?.Flags,
          ACCOUNT_FLAGS,
        ).includes('lsfGlobalFreeze')

        setProgressiveUpdates((prev) => ({
          ...prev,
          [issuer]: {
            transferFee: `${transferFee}%`,
            accountGlobalFrozen,
          },
        }))
      } catch (error) {
        log.error(
          `Error fetching account information: ${JSON.stringify(error)}`,
        )
      }
    }
  }, [sortedIOUs, rippledSocket])

  // Identify non-LP tokens - check which '03' tokens are regular IOUs (not LP tokens)
  const identifyNonLPTokensProgressively = useCallback(async () => {
    if (!heldIOUsQuery.data || heldIOUsQuery.data.length === 0) {
      setLpTokenCheckComplete(true)
      return
    }

    // Group tokens by issuer to minimize getAccountInfo calls
    const tokensByIssuer = new Map<string, string[]>()
    for (const token of heldIOUsQuery.data) {
      if (token.tokenCode.startsWith(LP_TOKEN_IDENTIFIER)) {
        const tokens = tokensByIssuer.get(token.issuer) || []
        tokens.push(token.tokenCode)
        tokensByIssuer.set(token.issuer, tokens)
      }
    }

    for (const [issuer, tokenCodes] of tokensByIssuer.entries()) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const accountInfo = await getAccountInfo(rippledSocket, issuer, false)

        // If the issuer does NOT have an AMMID, these are regular IOUs (non-LP tokens)
        if (!accountInfo.AMMID) {
          setConfirmedNonLPTokens((prev) => {
            const newSet = new Set(prev)
            for (const tokenCode of tokenCodes) {
              newSet.add(tokenCode)
            }
            return newSet
          })
        }
      } catch (error) {
        log.warn(
          `Error checking if issuer ${issuer} is AMM account: ${JSON.stringify(error)}`,
        )
        // If we can't fetch account info, assume it's not an AMM to be safe
        // Add these tokens to the confirmed non-LP list
        setConfirmedNonLPTokens((prev) => {
          const newSet = new Set(prev)
          for (const tokenCode of tokenCodes) {
            newSet.add(tokenCode)
          }
          return newSet
        })
      }
    }

    setLpTokenCheckComplete(true)
  }, [heldIOUsQuery.data, rippledSocket])

  // Start identifying non-LP tokens immediately after initial data loads
  useEffect(() => {
    if (heldIOUsQuery.data && heldIOUsQuery.data.length > 0) {
      identifyNonLPTokensProgressively()
    } else if (heldIOUsQuery.data && heldIOUsQuery.data.length === 0) {
      setLpTokenCheckComplete(true)
    }
  }, [heldIOUsQuery.data, identifyNonLPTokensProgressively])

  // Begin progressive updates once the LP token check is complete (we now have the final IOU list)
  useEffect(() => {
    if (lpTokenCheckComplete && sortedIOUs.length > 0) {
      fetchAccountInfoProgressively()
    }
  }, [lpTokenCheckComplete, sortedIOUs.length, fetchAccountInfoProgressively])

  // Communicate count and loading state back to parent
  // Keep loading state true until LP token checks are complete
  useEffect(() => {
    if (onChange) {
      onChange({
        count: iouTokens.length,
        isLoading: heldIOUsQuery.isLoading || !lpTokenCheckComplete,
      })
    }
  }, [
    iouTokens.length,
    heldIOUsQuery.isLoading,
    lpTokenCheckComplete,
    onChange,
  ])

  if (heldIOUsQuery.isLoading) {
    return <Loader />
  }

  return (
    <div className="account-asset-table">
      <table>
        <thead>
          <tr>
            <th>{t('account_page_asset_table_column_currency_code')}</th>
            <th>{t('account_page_asset_table_column_issuer')}</th>
            <th>{t('account_page_asset_table_column_price_usd')}</th>
            <th>{t('account_page_asset_table_column_balance')}</th>
            <th>{t('account_page_asset_table_column_balance_usd')}</th>
            <th>{t('account_page_asset_table_column_asset_class')}</th>
            <th>{t('account_page_asset_table_column_transfer_fee')}</th>
            <th>{t('account_page_asset_table_column_frozen')}</th>
          </tr>
        </thead>
        <tbody>
          {iouTokens.length === 0 ? (
            <EmptyMessageTableRow colSpan={9}>
              {t('account_page_asset_table_no_iou')}
            </EmptyMessageTableRow>
          ) : (
            iouTokens.map((token) => {
              const {
                formattedUsdPrice,
                formattedBalance,
                formattedBalanceUsd,
              } = calculateFormattedUsdBalance(
                token.balance,
                token.priceInUSD,
                lang,
              )

              return (
                <tr key={`${token.tokenCode}-${token.issuer}-${token.balance}`}>
                  <td>
                    <RouteLink
                      to={TOKEN_ROUTE}
                      params={{ token: `${token.tokenCode}.${token.issuer}` }}
                    >
                      <div className="token">
                        {token.tokenIcon ? (
                          <img
                            src={token.tokenIcon}
                            alt={token.tokenCode}
                            className="token-icon"
                          />
                        ) : (
                          <DefaultTokenIcon className="token-icon" />
                        )}
                        <Currency currency={token.tokenCode} />
                      </div>
                    </RouteLink>
                  </td>
                  <td>
                    <Account
                      displayText={
                        token.issuerName || shortenAccount(token.issuer)
                      }
                      account={token.issuer}
                    />
                  </td>
                  <td>{formattedUsdPrice}</td>
                  <td>{formattedBalance}</td>
                  <td>{formattedBalanceUsd}</td>
                  <td className="asset-class">{token.assetClass}</td>
                  <td className="transfer-fee">{token.transferFee || '--'}</td>
                  <td>{token.frozen}</td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
