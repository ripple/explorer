import { useContext, useEffect, useState } from 'react'
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
import { HoldersTable } from '../components/HoldersTable/HoldersTable'
import {
  LOSTransfer,
  TransfersTable,
} from '../components/TransfersTable/TransfersTable'
import { TokenHoldersData } from '../../../rippled/holders'

export interface TokenTransactionsTableProps {
  accountId: string
  currency: string
  holdersData?: TokenHoldersData
  isHoldersDataLoading: boolean
}

export const TokenTransactionTable = ({
  accountId,
  currency,
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
  console.log('tablePickerState', tablePickerState)

  const dummyDEXTransactions: LOSDEXTransaction[] = [
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, //format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, //format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, //format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, //format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, //format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, //format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, //format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, //format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount_in: '123',
      amount_out: '234',
      rate: 0.5, // probably just calc on spot
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      timestamp: 1231090, //format ripple epoch time
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
      last_active: 123456789, //format ripple epoch time
    },
    {
      rank: 2,
      account: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      num_tokens: 456789,
      percent_supply: 12.34,
      value_usd: 123456,
      last_active: 123456789, //format ripple epoch time
    },
    {
      rank: 3,
      account: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      num_tokens: 56789,
      percent_supply: 12.34,
      value_usd: 123456,
      last_active: 123456789, //format ripple epoch time
    },
    {
      rank: 4,
      account: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      num_tokens: 6789,
      percent_supply: 12.34,
      value_usd: 123456,
      last_active: 123456789, //format ripple epoch time
    },
    {
      rank: 5,
      account: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      num_tokens: 789,
      percent_supply: 12.34,
      value_usd: 123456,
      last_active: 123456789, //format ripple epoch time
    },
    {
      rank: 6,
      account: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      num_tokens: 89,
      percent_supply: 12.34,
      value_usd: 123456,
      last_active: 123456789, //format ripple epoch time
    },
  ]

  const dummyTransfers: LOSTransfer[] = [
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      action: 'Payment',
      timestamp: 1231090, //format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount: '123',
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      action: 'Payment',
      timestamp: 1231090, //format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount: '234',
    },
    {
      hash: '1A9FF30C6ADC165002425F764A3D87743F1674853D0D32DC123DF55D6438DEE0:OEQWIJRF',
      ledger: 9012123980,
      action: 'Payment',
      timestamp: 1231090, //format ripple epoch time
      from: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      to: 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
      amount: '345',
    },
  ]

  return (
    <div>
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
        <DexTradeTable transactions={dummyDEXTransactions} />
      )}

      {tablePickerState === 'transfers' && (
        <TransfersTable transactions={dummyTransfers} />
      )}

      {tablePickerState === 'holders' && (
        <HoldersTable holders={dummyHolders} />
      )}
    </div>
  )
}
