import { memo } from 'react'
import { Loader } from '../shared/components/Loader'
import { LedgerEntryTransaction } from './LedgerEntryTransaction'

/**
 * A separate component to handle iterating over the transactions for a ledger on the homepage.
 * It is a separate component so that it can benefit from React's memoization the array only changes once
 * when the ledger closes and the call returns will all its transactions
 * @param transactions
 * @constructor
 */
export const LedgerEntryTransactions = memo(
  ({ transactions }: { transactions: any[] }) => (
    <>
      {transactions == null && <Loader />}
      <div className="transactions">
        {transactions?.map((tx) => (
          <LedgerEntryTransaction transaction={tx} key={tx.hash} />
        ))}
      </div>
    </>
  ),
  (prevProps, nextProps) =>
    prevProps.transactions &&
    nextProps.transactions &&
    prevProps.transactions.length === nextProps.transactions.length,
)
