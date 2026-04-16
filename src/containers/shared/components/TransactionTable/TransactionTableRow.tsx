import { TxLabel } from '../TxLabel'
import { TxStatus } from '../TxStatus'
import { TxDetails } from '../TxDetails'
import { localizeDate, shortenTxHash, DATE_OPTIONS_NUMERIC } from '../../utils'
import './styles.scss'
import { useLanguage } from '../../hooks'
import TxToken from '../TxToken'
import { RouteLink } from '../../routing'
import { TRANSACTION_ROUTE } from '../../../App/routes'

export interface Props {
  tx: any
  hasTokensColumn?: boolean
  hasHashColumn?: boolean
}

export const TransactionTableRow = ({
  tx,
  hasTokensColumn,
  hasHashColumn,
}: Props) => {
  const language = useLanguage()
  const success = tx.result === 'tesSUCCESS'
  const date = localizeDate(new Date(tx.date), language, DATE_OPTIONS_NUMERIC)

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
