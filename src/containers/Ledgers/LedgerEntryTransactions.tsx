import { Loader } from '../shared/components/Loader'
import { LedgerEntryTransaction } from './LedgerEntryTransaction'

/**
 * A separate component to handle iterating over the transactions for a ledger on the homepage.
 * It is a separate component so that it can benefit from React's built in memoization as the array only changes once
 * when the ledger closes and the call returns will all its transactions
 * @param transactions
 * @constructor
 */
export const LedgerEntryTransactions = ({
  transactions,
}: {
  transactions: any[]
}) => (
  <>
    {transactions == null && <Loader />}
    <div className="transactions">
      {transactions?.map((tx) => (
        <LedgerEntryTransaction transaction={tx} key={tx.hash} />
      ))}
    </div>
  </>
)
