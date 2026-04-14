import { FC, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Account } from '../../shared/components/Account'
import { Amount } from '../../shared/components/Amount'
import { Loader } from '../../shared/components/Loader'
import { EmptyStateMessage } from '../../shared/components/EmptyStateMessage'
import { Pagination } from '../../shared/components/Pagination'
import { ResponsiveTimestamp } from '../../shared/components/ResponsiveTimestamp'
import {
  parseAmount,
  parseCurrencyAmount,
} from '../../shared/NumberFormattingUtils'
import { shortenAccount, shortenTxHash } from '../../shared/utils'
import { useLanguage } from '../../shared/hooks'
import { AMMDepositWithdrawFormatted } from '../types'

interface AMMDepositWithdrawTableProps {
  transactions: AMMDepositWithdrawFormatted[]
  isLoading: boolean
  totalItems: number
  currentPage: number
  onPageChange: (page: number) => void
  pageSize: number
  hasMore: boolean
  type: 'deposit' | 'withdraw'
}

export const AMMDepositWithdrawTable: FC<AMMDepositWithdrawTableProps> = ({
  transactions,
  isLoading,
  totalItems,
  currentPage,
  onPageChange,
  pageSize,
  hasMore,
  type,
}) => {
  const { t } = useTranslation()
  const language = useLanguage()
  const tableRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    if (!isLoading) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const tableContainer = tableRef.current?.closest(
            '.amm-deposit-withdraw-table',
          )
          if (tableContainer) {
            const rect = tableContainer.getBoundingClientRect()
            const scrollTop = window.scrollY + rect.top - 200
            window.scrollTo({ top: scrollTop, behavior: 'smooth' })
          }
        })
      })
    }
  }, [currentPage, isLoading])

  const lpTokenLabel =
    type === 'deposit' ? t('lp_tokens_received') : t('lp_tokens_redeemed')

  const renderAssetAmount = (asset: AMMDepositWithdrawFormatted['asset']) => {
    if (!asset || Number(asset.amount) === 0) {
      return '--'
    }

    return <Amount value={asset} displayIssuer shortenIssuer useParseAmount />
  }

  const renderTransaction = (tx: AMMDepositWithdrawFormatted) => (
    <tr key={`${tx.hash}-${tx.ledger}`}>
      <td className="tx-hash">
        <Link to={`/transactions/${tx.hash}`}>{shortenTxHash(tx.hash)}</Link>
      </td>
      <td className="tx-ledger">
        <Link to={`/ledgers/${tx.ledger}`}>{tx.ledger}</Link>
      </td>
      <td className="tx-timestamp">
        <ResponsiveTimestamp timestamp={tx.timestamp} lang={language} />
      </td>
      <td className="tx-account">
        <span className="text-truncate">
          <Account
            account={tx.account}
            displayText={shortenAccount(tx.account)}
          />
        </span>
      </td>
      <td className="tx-asset">{renderAssetAmount(tx.asset)}</td>
      <td className="tx-asset2">{renderAssetAmount(tx.asset2)}</td>
      <td className="tx-lp-tokens">
        {tx.lpTokens ? parseAmount(tx.lpTokens) : '--'}
      </td>
      <td className="tx-usd-value">
        {tx.valueUsd != null ? parseCurrencyAmount(tx.valueUsd) : '--'}
      </td>
    </tr>
  )

  return (
    <div className="amm-deposit-withdraw-table">
      {isLoading && <Loader />}

      {!isLoading && transactions.length > 0 && (
        <>
          <div className="notice-with-controls">
            <div className="data-notice">{t('token_page.dex_data_notice')}</div>
          </div>
          <div className="table-wrap">
            <table className="basic" ref={tableRef}>
              <thead>
                <tr>
                  <th className="tx-hash">{t('tx_hash')}</th>
                  <th className="tx-ledger">{t('ledger')}</th>
                  <th className="tx-timestamp">{t('timestamp')}</th>
                  <th className="tx-account">{t('account')}</th>
                  <th className="tx-asset">{t('asset')}</th>
                  <th className="tx-asset2">{t('asset_2')}</th>
                  <th className="tx-lp-tokens">{lpTokenLabel}</th>
                  <th className="tx-usd-value">{t('usd_value')}</th>
                </tr>
              </thead>
              <tbody>{transactions.map(renderTransaction)}</tbody>
            </table>
          </div>
          {(hasMore || currentPage > 1) && (
            <Pagination
              currentPage={currentPage}
              onPageChange={onPageChange}
              totalItems={totalItems}
              pageSize={pageSize}
              scrollToTop={null}
              showLastPage={!hasMore}
            />
          )}
        </>
      )}

      {!isLoading && transactions.length === 0 && (
        <EmptyStateMessage
          message={type === 'deposit' ? t('no_deposits') : t('no_withdrawals')}
        />
      )}
    </div>
  )
}
