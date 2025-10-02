import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useEffect, useContext } from 'react'
import { RouteLink } from '../../../shared/routing'
import { MPT_ROUTE } from '../../../App/routes'
import { Loader } from '../../../shared/components/Loader'
import { EmptyMessageTableRow } from '../../../shared/EmptyMessageTableRow'
import ClockIcon from '../../../shared/images/clock-icon.svg'
import { getAccountObjects } from '../../../../rippled/lib/rippled'
import SocketContext from '../../../shared/SocketContext'
import {
  formatMPTIssuance,
  formatTransferFee,
  shortenMPTID,
} from '../../../../rippled/lib/utils'
import { localizeNumber } from '../../../shared/utils'
import { useLanguage } from '../../../shared/hooks'
import logger from '../../../../rippled/lib/logger'

const log = logger({ name: 'IssuedMPTs' })

interface IssuedMPTsProps {
  accountId: string
  onChange?: (data: { count: number; isLoading: boolean }) => void
}

const fetchAccountIssuedMPTs = async (
  accountId: string,
  rippledSocket: any,
) => {
  log.info(`Fetching MPT Issuances for account ${accountId}`)

  const mptIssuances: any[] = []
  let marker = ''
  do {
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await getAccountObjects(
        rippledSocket,
        accountId,
        'mpt_issuance',
        marker,
      )
      if (!response?.account_objects) {
        break
      }

      mptIssuances.push(...response.account_objects)
      marker = response.marker || ''
    } catch (error) {
      log.error(`Error fetching MPT issuances: ${JSON.stringify(error)}`)
      // Break the loop on error to avoid infinite retry
      break
    }
  } while (marker)

  log.info(`Successfully fetched ${mptIssuances.length} MPT Issuances`)

  // Format the MPT issuances
  const issuedMPTs = mptIssuances.map((mptIssuance: any) => {
    const formattedIssuance = formatMPTIssuance(mptIssuance)

    return {
      tokenId: mptIssuance.mpt_issuance_id,
      ticker: formattedIssuance?.metadata?.Ticker || null,
      supply: formattedIssuance?.outstandingAmt || '0',
      assetClass: formattedIssuance?.metadata?.AssetClass || null,
      transferFee: formatTransferFee(formattedIssuance?.transferFee),
      locked: formattedIssuance?.flags?.includes('lsfMPTLocked')
        ? 'Global'
        : '',
    }
  })

  return issuedMPTs
}

export const IssuedMPTs = ({ accountId, onChange }: IssuedMPTsProps) => {
  const lang = useLanguage()
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)

  const issuedMPTsQuery = useQuery(['issuedMPTs', accountId], () =>
    fetchAccountIssuedMPTs(accountId, rippledSocket),
  )
  const rows = issuedMPTsQuery.data ?? []

  // Communicate count and loading state back to parent
  useEffect(() => {
    if (onChange) {
      onChange({ count: rows.length, isLoading: issuedMPTsQuery.isLoading })
    }
  }, [rows.length, issuedMPTsQuery.isLoading, onChange])

  if (issuedMPTsQuery.isLoading) {
    return <Loader />
  }

  return (
    <div className="account-asset-table">
      <table>
        <thead>
          <tr>
            <th>{t('account_page_asset_table_column_token_id')}</th>
            <th>{t('account_page_asset_table_column_ticker')}</th>
            <th>{t('account_page_asset_table_column_price_usd')}</th>
            <th>{t('account_page_asset_table_column_supply')}</th>
            <th>{t('account_page_asset_table_column_asset_class')}</th>
            <th>{t('account_page_asset_table_column_transfer_fee')}</th>
            <th>{t('account_page_asset_table_column_locked')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <EmptyMessageTableRow colSpan={7}>
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
                <td>
                  <span
                    className="future-feature"
                    title="This data will be provided in a forthcoming release."
                  >
                    <ClockIcon className="clock-icon" />
                  </span>
                </td>
                <td>
                  <span
                    className="future-feature"
                    title="This data will be provided in a forthcoming release."
                  >
                    <ClockIcon className="clock-icon" />
                  </span>
                </td>
                <td>{localizeNumber(token.supply, lang)}</td>
                <td>
                  <span
                    className="future-feature"
                    title="This data will be provided in a forthcoming release."
                  >
                    <ClockIcon className="clock-icon" />
                  </span>
                </td>
                <td className="transfer-fee">{token.transferFee}%</td>
                <td>
                  {token.locked === ''
                    ? '--'
                    : t('account_page_asset_table_mpt_locked_global')}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
