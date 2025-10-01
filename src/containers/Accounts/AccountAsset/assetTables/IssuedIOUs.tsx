import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useEffect } from 'react'
import Currency from '../../../shared/components/Currency'
import { Loader } from '../../../shared/components/Loader'
import { getIssuedIOUs } from '../api'
import { EmptyMessageTableRow } from '../../../shared/EmptyMessageTableRow'
import { localizeNumber } from '../../../shared/utils'
import { useLanguage } from '../../../shared/hooks'

interface IssuedIOUsProps {
  accountId: string
  account: any
  onCountChange?: (count: number) => void
}

export const IssuedIOUs = ({
  accountId,
  account,
  onCountChange,
}: IssuedIOUsProps) => {
  const lang = useLanguage()
  const { t } = useTranslation()

  const issuedIOUsQ = useQuery('issuedIOUs', getIssuedIOUs)
  const rows = issuedIOUsQ.data ?? []

  // Communicate count back to parent
  useEffect(() => {
    if (onCountChange) {
      onCountChange(rows.length)
    }
  }, [rows.length, onCountChange])

  if (issuedIOUsQ.isLoading) {
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
          {rows.length === 0 ? (
            <EmptyMessageTableRow colSpan={8}>
              {t('account_page_asset_table_no_iou')}
            </EmptyMessageTableRow>
          ) : (
            rows.map((token) => (
              <tr key={`${token.code}-${token.supply}`}>
                <td>
                  <Currency currency={token.code} />
                </td>
                <td>{localizeNumber(token.price, lang)}</td>
                <td>{token.trustlines}</td>
                <td>{token.holders}</td>
                <td className="right">{token.supply}</td>
                <td>{token.assetClass}</td>
                <td className="transfer-fee">{token.fee}</td>
                <td>{token.frozen}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
