import { memo } from 'react'
import { Loader } from '../shared/components/Loader'
import { LedgerEntryTransaction } from './LedgerEntryTransaction'

export const LedgerEntryTransactions = memo(
  ({ transactions }: { transactions: any[] }) => (
    <>
      {!transactions && <Loader />}
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
