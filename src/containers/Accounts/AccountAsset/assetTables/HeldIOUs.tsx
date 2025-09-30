import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useEffect, useContext, useState, useCallback, useMemo } from 'react'
import Currency from '../../../shared/components/Currency'
import { Loader } from '../../../shared/components/Loader'
import { Account } from '../../../shared/components/Account'
import { shortenAccount } from '../../../../rippled/lib/utils'
import { EmptyMessageTableRow } from '../../../shared/EmptyMessageTableRow'
import SocketContext from '../../../shared/SocketContext'
import {
  getBalances,
  getAccountLines,
  getAccountInfo,
} from '../../../../rippled/lib/rippled'

interface HeldIOUsProps {
  accountId: string
  onCountChange?: (count: number) => void
}

interface IOUData {
  code: string
  issuer: string
  balance: string
  balanceUsd: string | null
  price: string | null
  assetClass: string | null
  fee: string | null
  frozen: boolean
  logo?: string
}

const fetchHeldIOUs = async (
  rippledSocket: any,
  accountId: string,
): Promise<IOUData[]> => {
  // Check gateway_balances to see if account holds any IOUs
  const balancesResponse = await getBalances(rippledSocket, accountId)
  if (
    !balancesResponse?.assets ||
    Object.keys(balancesResponse.assets).length === 0
  ) {
    // No IOUs held, return empty array
    return []
  }

  // Get all trust lines using account_lines with pagination
  const allTrustLines: any[] = []
  let marker = ''
  let accountLinesCallCount = 0
  const startTime = performance.now()
  do {
    const callStartTime = performance.now()
    // eslint-disable-next-line no-await-in-loop
    const accountLinesResponse = await getAccountLines(
      rippledSocket,
      accountId,
      400,
      marker,
    )
    const callEndTime = performance.now()
    const callDuration = callEndTime - callStartTime

    accountLinesCallCount += 1

    // Calculate response size in bytes
    const responseSize = new TextEncoder().encode(
      JSON.stringify(accountLinesResponse),
    ).length

    // eslint-disable-next-line no-console
    console.log(
      `getAccountLines call #${accountLinesCallCount} took ${callDuration.toFixed(2)}ms, returned ${accountLinesResponse.lines?.length || 0} lines, response size: ${responseSize} bytes (${(responseSize / 1024).toFixed(2)} KB)`,
    )

    if (accountLinesResponse?.lines) {
      allTrustLines.push(...accountLinesResponse.lines)
    }

    marker = accountLinesResponse?.marker || ''
  } while (marker)

  const endTime = performance.now()
  const totalDuration = endTime - startTime

  // Log the total timing and call statistics
  // eslint-disable-next-line no-console
  console.log(
    `Total getAccountLines calls: ${accountLinesCallCount}, Total duration: ${totalDuration.toFixed(2)}ms, Average per call: ${(totalDuration / accountLinesCallCount).toFixed(2)}ms, Total trust lines fetched: ${allTrustLines.length}`,
  )

  // Step 3: Filter for positive balances (using original approach)
  const positiveBalanceLines = allTrustLines.filter(
    (line: any) => parseFloat(line.balance) > 0,
  )
  if (positiveBalanceLines.length === 0) {
    return []
  }

  // Step 4: Prepare token IDs for DGE API call
  const tokenIds = positiveBalanceLines.map(
    (line: any) => `${line.currency}.${line.account}`,
  )

  // Step 5: Batch get token info from DGE API (max 100 tokens per call)
  let tokenInfoMap: Record<string, any> = {}
  const dgeStartTime = performance.now()
  let dgeCallCount = 0

  // Process in batches of 100
  for (let i = 0; i < tokenIds.length; i += 100) {
    const batch = tokenIds.slice(i, i + 100)
    const batchStartTime = performance.now()

    try {
      // eslint-disable-next-line no-await-in-loop
      const dgeResponse = await fetch(
        'https://los.dev.ripplex.io/tokens/batch-get',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenIds: batch }),
        },
      )
      const batchEndTime = performance.now()
      const batchDuration = batchEndTime - batchStartTime
      dgeCallCount += 1

      // eslint-disable-next-line no-console
      console.log(
        `DGE batch-get call #${dgeCallCount} took ${batchDuration.toFixed(2)}ms for ${batch.length} tokens`,
      )

      if (dgeResponse.ok) {
        // eslint-disable-next-line no-await-in-loop
        const dgeData = await dgeResponse.json()
        const batchTokens =
          dgeData.tokens?.reduce((acc: any, token: any) => {
            acc[`${token.currency}.${token.issuer}`] = token
            return acc
          }, {}) || {}
        tokenInfoMap = { ...tokenInfoMap, ...batchTokens }
      }
    } catch (dgeError) {
      const batchEndTime = performance.now()
      const batchDuration = batchEndTime - batchStartTime
      dgeCallCount += 1

      // eslint-disable-next-line no-console
      console.log(
        `DGE batch-get call #${dgeCallCount} failed after ${batchDuration.toFixed(2)}ms for batch ${i / 100 + 1}:`,
        dgeError,
      )
    }
  }

  const dgeEndTime = performance.now()
  const dgeTotalDuration = dgeEndTime - dgeStartTime

  // eslint-disable-next-line no-console
  console.log(
    `Total DGE calls: ${dgeCallCount}, Total duration: ${dgeTotalDuration.toFixed(2)}ms, Average per call: ${dgeCallCount > 0 ? (dgeTotalDuration / dgeCallCount).toFixed(2) : 0}ms`,
  )

  // Step 6: Combine all data (without transfer fees and frozen status for now)
  const combinedData: IOUData[] = positiveBalanceLines.map((line: any) => {
    const tokenId = `${line.currency}.${line.account}`
    const tokenInfo = tokenInfoMap[tokenId]

    return {
      code: line.currency,
      issuer: line.account,
      balance: line.balance,
      balanceUsd:
        tokenInfo?.price && line.balance
          ? (parseFloat(line.balance) * parseFloat(tokenInfo.price)).toFixed(2)
          : null,
      price: tokenInfo?.price || null,
      assetClass: tokenInfo?.assetClass || null,
      fee: null, // Will be updated progressively
      frozen: line.freeze || line.freeze_peer || false, // Basic freeze info from trust line
      logo: tokenInfo?.logo,
    }
  })

  return combinedData
}

export const HeldIOUs = ({ accountId, onCountChange }: HeldIOUsProps) => {
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const [progressiveUpdates, setProgressiveUpdates] = useState<
    Record<string, { fee: string; frozen: boolean }>
  >({})

  // Use useQuery to fetch held IOUs data
  const heldIOUsQuery = useQuery(['heldIOUs', accountId], () =>
    fetchHeldIOUs(rippledSocket, accountId),
  )

  const baseIouData = useMemo(
    () => heldIOUsQuery.data || [],
    [heldIOUsQuery.data],
  )

  // Apply progressive updates to the base data
  const iouData = baseIouData.map((token) => ({
    ...token,
    fee: progressiveUpdates[token.issuer]?.fee || token.fee,
    frozen: progressiveUpdates[token.issuer]?.frozen ?? token.frozen,
  }))

  // Progressive fetching of issuer info for transfer fees and frozen status
  const fetchIssuerInfoProgressively = useCallback(async () => {
    if (baseIouData.length === 0) return

    const uniqueIssuers = [...new Set(baseIouData.map((line) => line.issuer))]

    // eslint-disable-next-line no-console
    console.log(
      `Starting progressive getAccountInfo calls for ${uniqueIssuers.length} issuers`,
    )

    let callCount = 0
    for (const issuer of uniqueIssuers) {
      try {
        const startTime = performance.now()
        // eslint-disable-next-line no-await-in-loop
        const issuerInfo = await getAccountInfo(rippledSocket, issuer)
        const endTime = performance.now()
        const duration = endTime - startTime
        callCount += 1

        const responseSize = new TextEncoder().encode(
          JSON.stringify(issuerInfo),
        ).length

        // eslint-disable-next-line no-console
        console.log(
          `getAccountInfo call #${callCount} for issuer ${issuer} took ${duration.toFixed(2)}ms, response size: ${responseSize} bytes (${(responseSize / 1024).toFixed(2)} KB)`,
        )

        const transferFee = issuerInfo?.TransferRate
          ? ((issuerInfo.TransferRate - 1000000000) / 10000000).toFixed(2)
          : '0'

        const globalFrozen = !!(issuerInfo?.Flags & 0x00400000)

        setProgressiveUpdates((prev) => ({
          ...prev,
          [issuer]: {
            fee: `${transferFee}%`,
            frozen: globalFrozen,
          },
        }))
      } catch (error) {
        callCount += 1
        // eslint-disable-next-line no-console
        console.log(
          `getAccountInfo call #${callCount} for issuer ${issuer} failed:`,
          error,
        )
      }

      // Small delay to avoid overwhelming the server
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    }
  }, [baseIouData, rippledSocket])

  // Start progressive updates after initial data is loaded
  useEffect(() => {
    if (baseIouData.length > 0) {
      fetchIssuerInfoProgressively()
    }
  }, [baseIouData.length, fetchIssuerInfoProgressively])

  // Communicate count back to parent
  useEffect(() => {
    if (onCountChange) {
      onCountChange(iouData.length)
    }
  }, [iouData.length, onCountChange])

  if (heldIOUsQuery.isLoading) {
    return <Loader />
  }

  if (heldIOUsQuery.error) {
    return (
      <div className="error">
        Error:{' '}
        {heldIOUsQuery.error instanceof Error
          ? heldIOUsQuery.error.message
          : 'Failed to fetch held IOUs'}
      </div>
    )
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
          {iouData.length === 0 ? (
            <EmptyMessageTableRow colSpan={9}>
              {t('account_page_asset_table_no_iou')}
            </EmptyMessageTableRow>
          ) : (
            iouData.map((token) => (
              <tr key={`${token.code}-${token.issuer}-${token.balance}`}>
                <td>
                  {token.logo ? (
                    <div className="currency-with-logo">
                      <img
                        src={token.logo}
                        alt={token.code}
                        className="token-logo"
                      />
                      <Currency currency={token.code} />
                    </div>
                  ) : (
                    <Currency currency={token.code} />
                  )}
                </td>
                <td>
                  <Account
                    shortAccount={shortenAccount(token.issuer)}
                    account={token.issuer}
                  />
                </td>
                <td>{token.price || '--'}</td>
                <td>{token.balance}</td>
                <td>{token.balanceUsd || '--'}</td>
                <td>{token.assetClass || '--'}</td>
                <td className="transfer-fee">{token.fee}</td>
                <td>{token.frozen ? 'Yes' : 'No'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
