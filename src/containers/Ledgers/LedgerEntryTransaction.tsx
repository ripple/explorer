import classNames from 'classnames'
import { getAction, getCategory } from '../shared/components/Transaction'
import { TRANSACTION_ROUTE } from '../App/routes'
import { TransactionActionIcon } from '../shared/components/TransactionActionIcon/TransactionActionIcon'
import { RouteLink } from '../shared/routing'
import { useTooltip } from '../shared/components/Tooltip'
import { TransactionSummary } from '../shared/types'

export const LedgerEntryTransaction = ({
  transaction,
}: {
  transaction: TransactionSummary
}) => {
  const { hideTooltip, showTooltip } = useTooltip()

  return (
    <RouteLink
      key={transaction.hash}
      className={classNames(
        `txn transaction-type transaction-dot bg`,
        `tx-category-${getCategory(transaction.type)}`,
        `transaction-action-${getAction(transaction.type)}`,
        `${transaction.result}`,
      )}
      onMouseOver={(e) => showTooltip('tx', e, transaction)}
      onFocus={() => {}}
      onMouseLeave={() => hideTooltip()}
      to={TRANSACTION_ROUTE}
      params={{ identifier: transaction.hash }}
    >
      <TransactionActionIcon type={transaction.type} />
      <span>{transaction.hash}</span>
    </RouteLink>
  )
}
