import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useEffect, useContext } from 'react'
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
  // Step 1: Check gateway_balances to see if account holds any IOUs
  const balancesResponse = await getBalances(rippledSocket, accountId)

  if (
    !balancesResponse?.assets ||
    Object.keys(balancesResponse.assets).length === 0
  ) {
    // No IOUs held, return empty array
    return []
  }

  console.log(balancesResponse.assets)

  // Step 2: Get all trust lines using account_lines with pagination
  const allTrustLines: any[] = []
  let marker = ''
  do {
    // eslint-disable-next-line no-await-in-loop
    const accountLinesResponse = await getAccountLines(
      rippledSocket,
      accountId,
      15,
      marker,
    )

    console.log(`The number of lines is: ${accountLinesResponse.lines.length}`)

    if (accountLinesResponse?.lines) {
      allTrustLines.push(...accountLinesResponse.lines)
    }

    marker = accountLinesResponse?.marker || ''
    console.log(`The marker of lines is: ${marker}`)
  } while (marker)

  // Step 3: Filter for positive balances
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

  // Step 5: Batch get token info from DGE API
  let tokenInfoMap: Record<string, any> = {}
  try {
    const dgeResponse = await fetch(
      'https://los.dev.ripplex.io/tokens/batch-get',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenIds }),
      },
    )

    if (dgeResponse.ok) {
      const dgeData = await dgeResponse.json()
      tokenInfoMap =
        dgeData.tokens?.reduce((acc: any, token: any) => {
          acc[`${token.currency}.${token.issuer}`] = token
          return acc
        }, {}) || {}
    }
  } catch (dgeError) {
    console.warn('Failed to fetch DGE token info:', dgeError)
  }

  // Step 6: Get unique issuers for transfer fee info
  const uniqueIssuers = [
    ...new Set(positiveBalanceLines.map((line: any) => line.account)),
  ]
  const issuerInfoMap: Record<string, any> = {}

  for (const issuer of uniqueIssuers) {
    try {
      const issuerInfo = await getAccountInfo(rippledSocket, issuer)
      issuerInfoMap[issuer] = issuerInfo
    } catch (issuerError) {
      console.warn(`Failed to get info for issuer ${issuer}:`, issuerError)
    }
  }

  // Step 7: Combine all data
  const combinedData: IOUData[] = positiveBalanceLines.map((line: any) => {
    const tokenId = `${line.currency}.${line.account}`
    const tokenInfo = tokenInfoMap[tokenId]
    const issuerInfo = issuerInfoMap[line.account]

    const transferFee = issuerInfo?.TransferRate
      ? ((issuerInfo.TransferRate - 1000000000) / 10000000).toFixed(2)
      : '0'

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
      fee: `${transferFee}%`,
      frozen:
        line.freeze ||
        line.freeze_peer ||
        issuerInfo?.Flags & 0x00400000 ||
        false,
      logo: tokenInfo?.logo,
    }
  })

  return combinedData
}

export const HeldIOUs = ({ accountId, onCountChange }: HeldIOUsProps) => {
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)

  // Use useQuery to fetch held IOUs data
  const heldIOUsQuery = useQuery(['heldIOUs', accountId], () =>
    fetchHeldIOUs(rippledSocket, accountId),
  )

  const iouData = heldIOUsQuery.data || []

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
