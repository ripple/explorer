import classNames from 'classnames'
import { getAction, getCategory } from '../shared/components/Transaction'
import { TRANSACTION_ROUTE } from '../App/routes'
import { TransactionActionIcon } from '../shared/components/TransactionActionIcon/TransactionActionIcon'
import { RouteLink } from '../shared/routing'
import { useTooltip } from './useTooltip'

export const LedgerEntryTransaction = ({
  transaction,
}: {
  transaction: any
}) => {
  const { setTooltip } = useTooltip()
  const showTooltip = (mode, event, data) => {
    setTooltip({
      ...data,
      mode,
      v: mode === 'validator' && data,
      x: event.currentTarget.offsetLeft,
      y: event.currentTarget.offsetTop,
    })
  }

  return (
    <RouteLink
      key={transaction.hash}
      className={classNames(
        `txn transaction-type transaction-dot bg`,
        `tx-category-${getCategory(transaction.type)}`,
        `transaction-action-${getAction(transaction.type)}`,
        `${transaction.result}`,
      )}
      onMouseOver={(e) => showTooltip('transaction', e, transaction)}
      onFocus={() => {}}
      onMouseLeave={() => setTooltip(undefined)}
      to={TRANSACTION_ROUTE}
      params={{ identifier: transaction.hash }}
    >
      <TransactionActionIcon type={transaction.type} />
      <span>{transaction.hash}</span>
    </RouteLink>
  )
}
