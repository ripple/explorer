import { TxLabel } from '../TxLabel'
import { TxStatus } from '../TxStatus'
import { TxDetails } from '../TxDetails'
import { Amount } from '../Amount'
import { formatAmount } from '../../../../rippled/lib/txSummary/formatAmount'
import { localizeDate, shortenTxHash } from '../../utils'
import './styles.scss'
import { useLanguage } from '../../hooks'
import TxToken from '../TxToken'
import { RouteLink } from '../../routing'
import { TRANSACTION_ROUTE } from '../../../App/routes'

const TIME_ZONE = 'UTC'
const DATE_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: true,
  timeZone: TIME_ZONE,
}

export interface Props {
  tx: any
  hasTokensColumn?: boolean
  hasAmountColumn?: boolean
  hasHashColumn?: boolean
}

export const TransactionTableRow = ({
  tx,
  hasTokensColumn,
  hasAmountColumn,
  hasHashColumn,
}: Props) => {
  const language = useLanguage()
  const success = tx.result === 'tesSUCCESS'
  const date = localizeDate(new Date(tx.date), language, DATE_OPTIONS)

  const renderTxWithFormattedAmount = ({ amount }) => (
    <Amount value={amount} displayIssuer={false} />
  )

  const renderTxWithoutFormattedAmount = ({ amount }) => (
    <Amount value={formatAmount(amount)} displayIssuer={false} />
  )

  // Determine which amount renderer to use, avoiding nested ternary
  const renderAmount = () => {
    if (tx.details?.instructions?.amount) {
      return renderTxWithFormattedAmount(tx.details.instructions.amount)
    }
    if (tx.details?.instructions?.Amount) {
      return renderTxWithoutFormattedAmount(tx.details.instructions.Amount)
    }
    return null
  }

  return (
    <li
      className={`transaction-li anchor-mask tx-type ${tx.type} ${
        success ? 'success' : 'fail'
      }`}
    >
      <RouteLink
        to={TRANSACTION_ROUTE}
        params={{ identifier: tx.hash }}
        className="mask-overlay"
      />
      <div className="upper">
        {hasHashColumn && (
          <div className="col col-hash" title={tx.hash}>
            {shortenTxHash(tx.hash)}
          </div>
        )}
        {hasTokensColumn && (
          <div className="col col-token">
            <TxToken tx={tx} />
          </div>
        )}
        <div className="col col-account" title={tx.account}>
          {tx.account}
        </div>
        <div className={`col col-type tx-type ${tx.type}`}>
          <TxLabel type={tx.type} />
        </div>
        {hasAmountColumn && (
          <div className="col col-amount">{renderAmount()}</div>
        )}
        <div className="col col-status">
          <TxStatus status={tx.result} />
        </div>
        <div className="col col-date">{date}</div>
      </div>
      {tx.details && (
        <div className="details">
          <TxDetails type={tx.type} instructions={tx.details.instructions} />
        </div>
      )}
    </li>
  )
}
