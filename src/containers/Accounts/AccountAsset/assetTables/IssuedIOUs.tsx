import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useEffect, useContext, useMemo } from 'react'
import Currency, {
  LP_TOKEN_IDENTIFIER,
} from '../../../shared/components/Currency'
import { Loader } from '../../../shared/components/Loader'
import { EmptyMessageTableRow } from '../../../shared/EmptyMessageTableRow'
import { RouteLink } from '../../../shared/routing'
import { TOKEN_ROUTE } from '../../../App/routes'
import SocketContext from '../../../shared/SocketContext'
import { getBalances } from '../../../../rippled/lib/rippled'
import logger from '../../../../rippled/lib/logger'
import DefaultTokenIcon from '../../../shared/images/default_token_icon.svg'
import { CURRENCY_OPTIONS, localizeNumber } from '../../../shared/utils'
import { useLanguage } from '../../../shared/hooks'
import { USD_CURRENCY_OPTIONS } from '../../../shared/CurrencyOptions'

const log = logger({ name: 'IssuedIOUs' })

const LOS_TOKEN_API_BATCH_SIZE = 100

interface IssuedIOUsProps {
  accountId: string
  account: any
  xrpToUSDRate: number
  onCountChange?: (count: number) => void
}

interface IOU {
  tokenCode: string
  tokenIcon?: string
  priceInXRP: number
  trustlines: number
  holders: number
  supply: number
  assetClass: string
  transferFee: string
  frozen: string
}

const fetchAccountIssuedIOUs = async (
  rippledSocket: any,
  accountId: string,
  account: any,
): Promise<IOU[]> => {
  log.info(`Finding issued IOUs via 'gatewayBalance' for account ${accountId}`)
  const balancesResponse = await getBalances(rippledSocket, accountId)

  const iouTokens: string[] = []
  if (balancesResponse?.obligations) {
    for (const currency of Object.keys(balancesResponse.obligations)) {
      if (!currency.startsWith(LP_TOKEN_IDENTIFIER)) {
        iouTokens.push(currency)
      }
    }
  }
  if (iouTokens.length === 0) {
    // No IOUs issued by this account, return empty array
    return []
  }

  // Batch get token data from LOS Token API
  const allTokenIds = iouTokens.map((currency) => `${currency}.${accountId}`)
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

  const transferFee = account?.info?.rate
  const accountGlobalFreeze = account?.info?.flags?.includes('lsfGlobalFreeze')

  const iouData: IOU[] = iouTokens.map((currency: string) => {
    const tokenId = `${currency}.${accountId}`
    const token = allTokens[tokenId]

    return {
      tokenCode: currency,
      tokenIcon: token?.icon,
      priceInXRP: token?.price ? parseFloat(token.price) : 0,
      trustlines: token?.number_of_trustlines || 0,
      holders: token?.number_of_holders || 0,
      supply: token?.supply || 0, // This including locked balance (see rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h)
      assetClass: token?.asset_class || '--',
      transferFee: `${transferFee}%`,
      frozen: accountGlobalFreeze ? 'Global' : '--',
    }
  })

  return iouData
}

export const IssuedIOUs = ({
  accountId,
  account,
  xrpToUSDRate,
  onCountChange,
}: IssuedIOUsProps) => {
  const lang = useLanguage()
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)

  const issuedIOUsQuery = useQuery(['issuedIOUs', accountId], () =>
    fetchAccountIssuedIOUs(rippledSocket, accountId, account),
  )

  // Sort by USD price
  const sortedIOUs = useMemo(() => {
    const data = issuedIOUsQuery.data || []
    return [...data].sort((a, b) => {
      const aBalanceUSD = a.priceInXRP * xrpToUSDRate
      const bBalanceUSD = b.priceInXRP * xrpToUSDRate
      return bBalanceUSD - aBalanceUSD
    })
  }, [issuedIOUsQuery.data, xrpToUSDRate])

  // Communicate count back to parent
  useEffect(() => {
    if (onCountChange) {
      onCountChange(sortedIOUs.length)
    }
  }, [sortedIOUs.length, onCountChange])

  if (issuedIOUsQuery.isLoading) {
    return <Loader />
  }

  return (
    <div className="account-asset-table">
      <table>
        <thead>
          <tr>
            <th>{t('account_page_asset_table_column_currency_code')}</th>
            <th>{t('account_page_asset_table_column_price_usd')}</th>
            <th>{t('account_page_asset_table_column_trustlines')}</th>
            <th>{t('account_page_asset_table_column_holders')}</th>
            <th>{t('account_page_asset_table_column_supply')}</th>
            <th>{t('account_page_asset_table_column_asset_class')}</th>
            <th>{t('account_page_asset_table_column_transfer_fee')}</th>
            <th>{t('account_page_asset_table_column_frozen')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedIOUs.length === 0 ? (
            <EmptyMessageTableRow colSpan={8}>
              {t('account_page_asset_table_no_iou')}
            </EmptyMessageTableRow>
          ) : (
            sortedIOUs.map((token) => (
              <tr key={`${token.tokenCode}-${token.supply}`}>
                <td>
                  <RouteLink
                    to={TOKEN_ROUTE}
                    params={{ token: `${token.tokenCode}.${accountId}` }}
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
                  {(() => {
                    const usdPrice = token.priceInXRP * xrpToUSDRate
                    const currencyOptions =
                      usdPrice < 1 ? CURRENCY_OPTIONS : USD_CURRENCY_OPTIONS
                    return localizeNumber(usdPrice, lang, currencyOptions)
                  })()}
                </td>
                <td>{localizeNumber(token.trustlines, lang)}</td>
                <td>{localizeNumber(token.holders, lang)}</td>
                <td className="right">{token.supply}</td>
                <td className="asset-class">{token.assetClass}</td>
                <td className="transfer-fee">{token.transferFee}</td>
                <td>{token.frozen}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
