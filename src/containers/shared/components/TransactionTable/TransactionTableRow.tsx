import { TxLabel } from '../TxLabel'
import { TxStatus } from '../TxStatus'
import { TxDetails } from '../TxDetails'
import { localizeDate } from '../../utils'
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
}

export const TransactionTableRow = ({ tx, hasTokensColumn }: Props) => {
  const language = useLanguage()
  const success = tx.result === 'tesSUCCESS'
  const date = localizeDate(new Date(tx.date), language, DATE_OPTIONS)

  return (
    <li
      className={`transaction-li anchor-mask tx-type ${tx.type} ${
        success ? 'success' : 'fail'
      }`}
      title="tx-row"
    >
      <RouteLink
        to={TRANSACTION_ROUTE}
        params={{ identifier: tx.hash }}
        className="mask-overlay"
      />
      <div className="upper">
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
        <div className="col col-status">
          <TxStatus status={tx.result} />
        </div>
        <div className="col col-date">{date}</div>
      </div>
      {tx.details && (
        <div className="details" title="tx-details">
          <TxDetails type={tx.type} instructions={tx.details.instructions} />
        </div>
      )}
    </li>
  )
}
