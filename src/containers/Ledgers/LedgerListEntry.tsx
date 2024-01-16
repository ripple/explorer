import { useTranslation } from 'react-i18next'
import { Loader } from '../shared/components/Loader'
import { Ledger, ValidatorResponse } from './types'
import { RouteLink } from '../shared/routing'
import { LEDGER_ROUTE } from '../App/routes'
import { Amount } from '../shared/components/Amount'
import { LedgerEntryTransaction } from './LedgerEntryTransaction'
import { LedgerEntryHash } from './LedgerEntryHash'

const SIGMA = '\u03A3'

const LedgerIndex = ({ ledgerIndex }: { ledgerIndex: number }) => {
  const { t } = useTranslation()
  const flagLedger = ledgerIndex % 256 === 0
  return (
    <div
      className={`ledger-index ${flagLedger ? 'flag-ledger' : ''}`}
      title={flagLedger ? t('flag_ledger') : ''}
    >
      <RouteLink to={LEDGER_ROUTE} params={{ identifier: ledgerIndex }}>
        {ledgerIndex}
      </RouteLink>
    </div>
  )
}

export const LedgerListEntry = ({
  ledger,
  unlCount,
  validators,
}: {
  ledger: Ledger
  unlCount?: number
  validators: { [pubkey: string]: ValidatorResponse }
}) => {
  const { t } = useTranslation()
  const time = ledger.close_time
    ? new Date(ledger.close_time).toLocaleTimeString()
    : null
  const transactions = ledger.transactions || []

  return (
    <div className="ledger" key={ledger.ledger_index}>
      <div className="ledger-head">
        <LedgerIndex ledgerIndex={ledger.ledger_index} />
        <div className="close-time">{time}</div>
        {/* Render Transaction Count (can be 0) */}
        {ledger.txn_count !== undefined && (
          <div className="txn-count">
            {t('txn_count')}:<b>{ledger.txn_count.toLocaleString()}</b>
          </div>
        )}
        {/* Render Total Fees (can be 0) */}
        {ledger.total_fees !== undefined && (
          <div className="fees">
            {SIGMA} {t('fees')}:
            <b>
              <Amount value={{ currency: 'XRP', amount: ledger.total_fees }} />
            </b>
          </div>
        )}
        {ledger.transactions == null && <Loader />}
        <div className="transactions">
          {transactions.map((tx) => (
            <LedgerEntryTransaction transaction={tx} key={tx.hash} />
          ))}
        </div>
      </div>
      <div className="hashes">
        {ledger.hashes.map((hash) => (
          <LedgerEntryHash
            hash={hash}
            key={hash.hash}
            unlCount={unlCount}
            validators={validators}
          />
        ))}
      </div>
    </div>
  )
}
