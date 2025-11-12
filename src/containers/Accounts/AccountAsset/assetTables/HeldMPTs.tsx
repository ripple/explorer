import { useQuery } from 'react-query'
import { useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteLink } from '../../../shared/routing'
import { MPT_ROUTE } from '../../../App/routes'
import { Loader } from '../../../shared/components/Loader'
import { EmptyMessageTableRow } from '../../../shared/EmptyMessageTableRow'
import { Account } from '../../../shared/components/Account'
import { Tooltip, useTooltip } from '../../../shared/components/Tooltip'
import {
  formatMPTIssuance,
  formatMPToken,
  formatTransferFee,
} from '../../../../rippled/lib/utils'
import { getAccountMPTs, getMPTIssuance } from '../../../../rippled/lib/rippled'
import SocketContext from '../../../shared/SocketContext'
import {
  localizeNumber,
  shortenAccount,
  shortenMPTID,
} from '../../../shared/utils'
import { useLanguage } from '../../../shared/hooks'
import logger from '../../../../rippled/lib/logger'
import { FutureDataIcon } from '../FutureDataIcon'

const log = logger({ name: 'HeldMPTs' })

interface HeldMPTsProps {
  accountId: string
  onChange?: (data: { count: number; isLoading: boolean }) => void
}

const fetchAccountHeldMPTs = async (accountId: string, rippledSocket: any) => {
  const mpts: any[] = []
  let marker = ''
  do {
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await getAccountMPTs(rippledSocket, accountId, marker)
      if (!response?.account_objects) {
        break
      }

      mpts.push(...response.account_objects)
      marker = response.marker || ''
    } catch (error) {
      log.error(`Error fetching MPTs: ${JSON.stringify(error)}`)
      // Break the loop on error to avoid infinite retry
      break
    }
  } while (marker)

  // Format and filter MPTs
  const positiveBalanceMPTs = mpts
    .map((mpToken: any) => formatMPToken(mpToken))
    .filter((mpToken: any) => parseInt(mpToken.mptAmount || '0', 10) > 0)

  // For each MPTokenIssuanceID, call getMPTIssuance and format the response
  const mptIssuancePromises = positiveBalanceMPTs.map(async (mpToken: any) => {
    try {
      const mptIssuanceResponse = await getMPTIssuance(
        rippledSocket,
        mpToken.mptIssuanceID,
      )

      const formattedMPTIssuance = formatMPTIssuance(mptIssuanceResponse.node)
      return {
        mptIssuanceId: mpToken.mptIssuanceID,
        mptIssuance: formattedMPTIssuance,
      }
    } catch (error) {
      log.error(
        `Error fetching MPT issuance for token ${mpToken.mptIssuanceID}: ${JSON.stringify(error)}`,
      )
      return { mptIssuanceId: mpToken.mptIssuanceID, mptIssuance: null }
    }
  })

  const mptIssuanceResults = await Promise.all(mptIssuancePromises)
  const mptIssuanceIdToIssuance = new Map()
  mptIssuanceResults.forEach((result) => {
    if (result && result.mptIssuance) {
      mptIssuanceIdToIssuance.set(result.mptIssuanceId, result.mptIssuance)
    }
  })

  // Combine MPToken and MPTIssuance data
  const combinedMPTs = positiveBalanceMPTs.map((mpToken: any) => {
    const mptIssuance = mptIssuanceIdToIssuance.get(mpToken.mptIssuanceID)

    return {
      tokenId: mpToken.mptIssuanceID,
      // MPT balance must be scaled by the appropriate asset_scale exponent.
      // Please refer to this documentation for more details:
      // https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuancecreate#mptokenissuancecreate-fields
      balance: mpToken.mptAmount * 10 ** -(mptIssuance?.assetScale ?? 0),
      ticker: mptIssuance?.metadata?.Ticker || null,
      issuer: mptIssuance?.issuer || '',
      issuerName: mptIssuance?.metadata?.IssuerName || null,
      assetClass: mptIssuance?.metadata?.AssetClass || null,
      transferFee: formatTransferFee(mptIssuance?.transferFee, 'MPT'),
      locked: (() => {
        if (mptIssuance?.flags?.includes('lsfMPTLocked')) {
          return 'Global'
        }
        if (mpToken.flags?.includes('lsfMPTLocked')) {
          return 'Individual'
        }

        return ''
      })(),
    }
  })

  return combinedMPTs
}

const HeldMPTsContent = ({ accountId, onChange }: HeldMPTsProps) => {
  const lang = useLanguage()
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const { tooltip } = useTooltip()

  const heldMPTsQuery = useQuery(['heldMPTs', accountId], () =>
    fetchAccountHeldMPTs(accountId, rippledSocket),
  )
  // TODO: When MPT Dex is live, sort MPTs based on USD balances
  const rows = heldMPTsQuery.data ?? []

  // Communicate count and loading state back to parent
  useEffect(() => {
    if (onChange) {
      onChange({ count: rows.length, isLoading: heldMPTsQuery.isLoading })
    }
  }, [rows.length, heldMPTsQuery.isLoading, onChange])

  if (heldMPTsQuery.isLoading) {
    return <Loader />
  }

  return (
    <div className="account-asset-table">
      <Tooltip tooltip={tooltip} />
      <table>
        <thead>
          <tr>
            <th>{t('account_page_asset_table_column_token_id')}</th>
            <th>{t('account_page_asset_table_column_ticker')}</th>
            <th>{t('account_page_asset_table_column_issuer')}</th>
            <th>{t('account_page_asset_table_column_price_usd')}</th>
            <th>{t('account_page_asset_table_column_balance')}</th>
            <th>{t('account_page_asset_table_column_balance_usd')}</th>
            <th>{t('account_page_asset_table_column_asset_class')}</th>
            <th>{t('account_page_asset_table_column_transfer_fee')}</th>
            <th>{t('account_page_asset_table_column_locked')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <EmptyMessageTableRow colSpan={9}>
              {t('account_page_asset_table_no_mpt')}
            </EmptyMessageTableRow>
          ) : (
            rows.map((token) => (
              <tr key={token.tokenId}>
                <td>
                  <RouteLink to={MPT_ROUTE} params={{ id: token.tokenId }}>
                    {shortenMPTID(token.tokenId)}
                  </RouteLink>
                </td>
                <td>{token.ticker ? token.ticker : <FutureDataIcon />}</td>
                <td>
                  <Account
                    account={token.issuer}
                    displayText={
                      token.issuerName || shortenAccount(token.issuer)
                    }
                  />
                </td>
                <td>
                  <FutureDataIcon />
                </td>
                <td>{localizeNumber(token.balance, lang)}</td>
                <td>
                  <FutureDataIcon />
                </td>
                <td>
                  {token.assetClass ? token.assetClass : <FutureDataIcon />}
                </td>
                <td className="transfer-fee">{token.transferFee}%</td>
                <td>
                  {(() => {
                    if (token.locked === '') {
                      return '--'
                    }
                    if (token.locked === 'Global') {
                      return t('account_page_asset_table_mpt_locked_global')
                    }
                    if (token.locked === 'Individual') {
                      return t('account_page_asset_table_mpt_locked_individual')
                    }
                    return token.locked
                  })()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export const HeldMPTs = ({ accountId, onChange }: HeldMPTsProps) => (
  <HeldMPTsContent accountId={accountId} onChange={onChange} />
)
