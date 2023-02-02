import { Link } from 'react-router-dom'
import { TxLabel } from '../shared/components/TxLabel'
import { TxDetails } from '../shared/components/TxDetails'
import { useLanguage } from '../shared/hooks'
import Sequence from '../shared/components/Sequence'
import { formatPrice } from '../shared/utils'
import { TxStatus } from '../shared/components/TxStatus'

const TXN_COST_PADDING = 6

export interface Props {
  tx: any
}

export const LedgerTransactionTableRow = ({ tx }: Props) => {
  const language = useLanguage()
  const success = tx.result === 'tesSUCCESS'

  return (
    <li
      className={`transaction-li anchor-mask tx-type ${tx.type} ${
        success ? 'success' : 'fail'
      }`}
    >
      <Link to={`/transactions/${tx.hash}`} className="mask-overlay" />
      <div className="upper">
        <div className={`col col-type tx-type ${tx.type}`}>
          <TxLabel type={tx.type} />
        </div>
        <div className="col col-account">{tx.account}</div>
        <div className="col col-sequence">
          <Sequence
            sequence={tx.sequence}
            ticketSequence={tx.ticketSequence}
            account={tx.account}
          />
        </div>
        <div className="col col-fee">
          {formatPrice(tx.fee, {
            lang: language,
            currency: 'XRP',
            padding: TXN_COST_PADDING,
          })}
        </div>
      </div>
      {tx.details && (
        <div className="details">
          {success ? null : <TxStatus status={tx.result} />}
          <TxDetails type={tx.type} instructions={tx.details.instructions} />
        </div>
      )}
    </li>
  )
}
