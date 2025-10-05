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
  log.info(`Finding held IOUs via 'gatewayBalances' for account ${accountId}`)
  let balancesResponse
  try {
    balancesResponse = await getBalances(rippledSocket, accountId)
  } catch (error) {
    log.error(
      `Error calling 'gatewayBalances' for account ${accountId}: ${JSON.stringify(error)}`,
    )
    return []
  }

  // Identify LP tokens by checking if it starts with '03' and the issuer account is an AMM account
  const lpTokens = new Set<string>()
  const assetsByIssuer = Object.entries(balancesResponse?.assets ?? {})
  for (const [issuer, assets] of assetsByIssuer) {
    const potentialLPTokenAssets = (assets as any[]).filter((asset) =>
      asset.currency?.startsWith(LP_TOKEN_IDENTIFIER),
    )

    if (potentialLPTokenAssets.length > 0) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const accountInfo = await getAccountInfo(rippledSocket, issuer, false)
        if (accountInfo?.AMMID) {
          for (const asset of potentialLPTokenAssets) {
            lpTokens.add(asset.currency)
          }
        }
      } catch (error) {
        log.warn(
          `Error fetching account info for issuer ${issuer}: ${JSON.stringify(error)}`,
        )
        // If we can't fetch account info, assume it's not an AMM to be safe
      }
    }
  }

  log.info(`Found ${lpTokens.size} LP Tokens`)

  // Collect all non-LP tokens
  const iouTokens: any[] = []
  for (const assets of Object.values(balancesResponse?.assets ?? {})) {
    for (const asset of assets as any[]) {
      if (asset.currency && !lpTokens.has(asset.currency)) {
        iouTokens.push(asset.currency)
      }
    }
  }
  if (iouTokens.length === 0) {
    // No IOUs held, return empty array
    return []
  }

  log.info(
    `Identified ${lpTokens.size} LP tokens, proceeding with ${iouTokens.length} IOU currencies`,
  )

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
  log.info(`Found ${allTrustLines.length} trust lines`)

  // Filter for positive balances and exclude LP tokens (using the identified LP token set)
  const positiveBalanceLines = allTrustLines.filter(
    (line: any) => parseFloat(line.balance) > 0 && !lpTokens.has(line.currency),
  )
  log.info(
    `${positiveBalanceLines.length} IOU trust lines with positive balances`,
  )
  if (positiveBalanceLines.length === 0) {
    return []
  }

  // Batch get token data from LOS Token API
  const allTokenIds = positiveBalanceLines.map(
    (line: any) => `${line.currency}.${line.account}`,
  )
  let allTokens: Record<string, any> = {}
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
        const tokens =
          responseBody.tokens?.reduce((acc: any, token: any) => {
            acc[`${token.currency}.${token.issuer_account}`] = {
              ...token,
            }
            return acc
          }, {}) || {}
        allTokens = { ...allTokens, ...tokens }
      }
    } catch (error) {
      log.error(
        `Error batch-get tokens[${tokenIds.join(', ')}]. Error: ${JSON.stringify(error)}`,
      )
    }
  }
  log.info(
    `Successfully fetched LOS data for ${Object.keys(allTokens).length} held IOUs`,
  )
  // Combine all data (without transfer fees and Global freeze status for now)
  const iouData: IOU[] = positiveBalanceLines.map((line: any) => {
    const tokenId = `${line.currency}.${line.account}`
    const token = allTokens[tokenId]

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

  return iouData
}

export const HeldIOUs = ({ accountId, onChange }: HeldIOUsProps) => {
  const lang = useLanguage()
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const [progressiveUpdates, setProgressiveUpdates] = useState<
    Record<string, { transferFee: string; accountGlobalFrozen: boolean }>
  >({})

  const heldIOUsQuery = useQuery(['heldIOUs', accountId], () =>
    fetchAccountHeldIOUs(rippledSocket, accountId),
  )

  // Get data and sort by USD balance in one step
  const sortedIOUs = useMemo(() => {
    const data = heldIOUsQuery.data || []
    return [...data].sort(
      (a, b) => b.priceInUSD * b.balance - a.priceInUSD * a.balance,
    )
  }, [heldIOUsQuery.data])

  // Apply progressive updates to the base data
  const ious = sortedIOUs.map((token) => {
    const progressiveUpdate = progressiveUpdates[token.issuer]
    return {
      ...token,
      transferFee: progressiveUpdate?.transferFee || token.transferFee,
      frozen: progressiveUpdate?.accountGlobalFrozen ? 'Global' : token.frozen,
    }
  })

  // Progressive fetching of issuer info for transfer fee and Global freeze status
  const fetchIssuerInfoProgressively = useCallback(async () => {
    if (sortedIOUs.length === 0) {
      return
    }

    const uniqueIssuers = [...new Set(sortedIOUs.map((line) => line.issuer))]
    for (const issuer of uniqueIssuers) {
      try {
        log.info(`Fetching account information for account ${issuer}`)
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

  // Start progressive updates after initial data is loaded
  useEffect(() => {
    if (sortedIOUs.length > 0) {
      fetchIssuerInfoProgressively()
    }
  }, [sortedIOUs.length, fetchIssuerInfoProgressively])

  // Communicate count and loading state back to parent
  useEffect(() => {
    if (onChange) {
      onChange({ count: ious.length, isLoading: heldIOUsQuery.isLoading })
    }
  }, [ious.length, heldIOUsQuery.isLoading, onChange])

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
          {ious.length === 0 ? (
            <EmptyMessageTableRow colSpan={9}>
              {t('account_page_asset_table_no_iou')}
            </EmptyMessageTableRow>
          ) : (
            ious.map((token) => {
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
                      shortAccount={
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
