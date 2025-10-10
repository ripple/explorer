import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'

import { useAnalytics } from '../../shared/analytics'
import SocketContext from '../../shared/SocketContext'
import { TransactionTable } from '../../shared/components/TransactionTable/TransactionTable'
import { getAccountTransactions } from '../../../rippled'
import { TxTablePicker } from '../components/TxTablePicker/TxTablePicker'
import {
  DexTradeTable,
  LOSDEXTransaction,
} from '../components/DexTradeTable/DexTradeTable'
import {
  HoldersTable,
  XRPLHolder,
} from '../components/HoldersTable/HoldersTable'
import {
  LOSTransfer,
  TransfersTable,
} from '../components/TransfersTable/TransfersTable'
import { TokenHoldersData } from '../../../rippled/holders'
import { LOSToken } from '../../shared/losTypes'

export interface TokenTransactionsTableProps {
  accountId: string
  currency: string
  holdersData?: TokenHoldersData
  isHoldersDataLoading: boolean
  dexTrades?: any
  isDexTradesLoading: boolean
  transfers?: any
  isTransfersLoading: boolean
  xrpUSDRate: string
  tokenData: LOSToken
  holdersPage: number
  setHoldersPage: (page: number) => void
  holdersPageSize: number
  transfersPage: number
  setTransfersPage: (page: number) => void
  transfersPageSize: number
  dexTradesPage: number
  setDexTradesPage: (page: number) => void
  dexTradesPageSize: number
  totalDexTrades: number
}

export const TokenTransactionTable = ({
  accountId,
  currency,
  holdersData,
  isHoldersDataLoading,
  dexTrades,
  isDexTradesLoading,
  transfers,
  isTransfersLoading,
  xrpUSDRate,
  tokenData,
  holdersPage,
  setHoldersPage,
  holdersPageSize,
  transfersPage,
  setTransfersPage,
  transfersPageSize,
  dexTradesPage,
  setDexTradesPage,
  dexTradesPageSize,
  totalDexTrades,
}: TokenTransactionsTableProps) => {
  const { trackException } = useAnalytics()
  const rippledSocket = useContext(SocketContext)
  const { t } = useTranslation()

  const {
    data,
    error,
    isFetching: loading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<any, Error>(
    ['fetchTransactions', accountId, currency],
    ({ pageParam = '' }) =>
      getAccountTransactions(
        accountId,
        currency,
        pageParam,
        undefined,
        rippledSocket,
      ).catch((errorResponse) => {
        const errorLocation = `token transactions ${accountId}.${currency} at ${pageParam}`
        trackException(`${errorLocation} --- ${JSON.stringify(errorResponse)}`)

        throw new Error('get_account_transactions_failed')
      }),
    {
      getNextPageParam: (lastPage) => lastPage.marker,
    },
  )

  const [tablePickerState, setTablePickerState] = useState('all')

  const dummyDEXTransactions: LOSDEXTransaction[] = [
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, // format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, // format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, // format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, // format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, // format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, // format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, // format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, // format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, // format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
  ]
  const dummyHolders = [
    {
      rank: 1,
      account: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      num_tokens: 123456789,
      percent_supply: 12.34,
      value_usd: 123456,
      last_active: 123456789, // format ripple epoch time
    },
    {
      rank: 2,
      account: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      num_tokens: 456789,
      percent_supply: 12.34,
      value_usd: 123456,
      last_active: 123456789, // format ripple epoch time
    },
    {
      rank: 3,
      account: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      num_tokens: 56789,
      percent_supply: 12.34,
      value_usd: 123456,
      last_active: 123456789, // format ripple epoch time
    },
    {
      rank: 4,
      account: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      num_tokens: 6789,
      percent_supply: 12.34,
      value_usd: 123456,
      last_active: 123456789, // format ripple epoch time
    },
    {
      rank: 5,
      account: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      num_tokens: 789,
      percent_supply: 12.34,
      value_usd: 123456,
      last_active: 123456789, // format ripple epoch time
    },
    {
      rank: 6,
      account: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      num_tokens: 89,
      percent_supply: 12.34,
      value_usd: 123456,
      last_active: 123456789, // format ripple epoch time
    },
  ]
  const dummyTransfers: LOSTransfer[] = [
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      action: 'Payment',
      timestamp: 1231090, // format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount: '123',
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      action: 'Payment',
      timestamp: 1231090, // format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount: '234',
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      action: 'Payment',
      timestamp: 1231090, // format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount: '345',
    },
  ]

  // assign rank to each holder and calculate USD value
  const XRPUSDPrice = Number(xrpUSDRate) || 0
  let holdersFormatted: XRPLHolder[] = []
  holdersFormatted =
    holdersData?.holders.map((holder, index) => ({
      ...holder,
      rank: (holdersPage - 1) * holdersPageSize + index + 1,
      value_usd: holder.balance * Number(tokenData?.price) * XRPUSDPrice,
    })) || []

  let transfersFormatted: LOSTransfer[] = []
  transfersFormatted =
    transfers?.results.map((transfer) => ({
      hash: transfer.hash,
      ledger: transfer.ledger_index,
      action: transfer.type,
      timestamp: transfer.timestamp, // format ripple epoch time
      from: transfer.account,
      to: transfer.destination,
      amount: transfer.amount,
    })) || []

  let dexTradesFormatted: LOSDEXTransaction[] = []
  if (dexTrades && dexTrades.results) {
    dexTradesFormatted = dexTrades.results
      .map((result: any) =>
        (result.dex_trades || []).map((trade: any) => ({
          ...trade,
          hash: result.hash,
          ledger: result.ledger_index,
          timestamp: result.timestamp,
          rate:
            trade.amount_out && Number(trade.amount_out.value) !== 0
              ? Number(trade.amount_in.value) / Number(trade.amount_out.value)
              : null,
          amount_in: {
            currency: trade.amount_in.currency,
            issuer: trade.amount_in.issuer,
            amount: trade.amount_in.value,
          },
          amount_out: {
            currency: trade.amount_out.currency,
            issuer: trade.amount_out.issuer,
            amount: trade.amount_out.value,
          },
        })),
      )
      .flat()
  }

  return (
    <div className="token-transaction-table-container">
      <TxTablePicker
        tablePickerState={tablePickerState}
        setTablePickerState={setTablePickerState}
      />

      {tablePickerState === 'all' && (
        <TransactionTable
          transactions={data?.pages
            ?.map((page: any) => page.transactions)
            .flat()}
          loading={loading}
          emptyMessage={t(error?.message || ('' as any))}
          onLoadMore={() => fetchNextPage()}
          hasAdditionalResults={hasNextPage}
        />
      )}

      {tablePickerState === 'dex' && (
        <DexTradeTable
          transactions={dexTrades}
          isLoading={isDexTradesLoading}
          totalTrades={totalDexTrades}
          currentPage={dexTradesPage}
          onPageChange={setDexTradesPage}
          pageSize={dexTradesPageSize}
        />
      )}

      {tablePickerState === 'transfers' && (
        <TransfersTable
          transactions={transfersFormatted}
          isTransfersLoading={isTransfersLoading}
          totalTransfers={transfers?.total || 0}
          currentPage={transfersPage}
          onPageChange={setTransfersPage}
          pageSize={transfersPageSize}
        />
      )}

      {tablePickerState === 'holders' && (
        <HoldersTable
          isHoldersDataLoading={isHoldersDataLoading}
          holders={holdersFormatted}
          totalHolders={holdersData?.totalHolders || 0}
          currentPage={holdersPage}
          onPageChange={setHoldersPage}
          pageSize={holdersPageSize}
        />
      )}
    </div>
  )
}
