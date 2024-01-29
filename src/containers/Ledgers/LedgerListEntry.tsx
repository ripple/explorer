import { useTranslation } from 'react-i18next'
import { RouteLink } from '../shared/routing'
import { LEDGER_ROUTE } from '../App/routes'
import { Amount } from '../shared/components/Amount'
import { LedgerEntryHash } from './LedgerEntryHash'
import { LedgerEntryTransactions } from './LedgerEntryTransactions'
import { Ledger } from '../shared/components/Streams/types'
import {
  Tooltip,
  TooltipProvider,
  useTooltip,
} from '../shared/components/Tooltip'

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

export const LedgerListEntryInner = ({ ledger }: { ledger: Ledger }) => {
  const { tooltip } = useTooltip()
  const { t } = useTranslation()
  const time = ledger.closeTime
    ? new Date(ledger.closeTime).toLocaleTimeString()
    : null

  return (
    <div className="ledger" key={ledger.index}>
      <div className="ledger-head">
        <LedgerIndex ledgerIndex={ledger.index} />
        <div className="close-time">{time}</div>
        {/* Render Transaction Count (can be 0) */}
        {ledger.txCount !== undefined && (
          <div className="txn-count">
            {t('txn_count')}:<b>{ledger.txCount.toLocaleString()}</b>
          </div>
        )}
        {/* Render Total Fees (can be 0) */}
        {ledger.totalFees !== undefined && (
          <div className="fees">
            {SIGMA} {t('fees')}:
            <b>
              <Amount value={{ currency: 'XRP', amount: ledger.totalFees }} />
            </b>
          </div>
        )}
        <LedgerEntryTransactions transactions={ledger.transactions} />
      </div>
      <div className="hashes">
        {ledger.hashes.map((hash) => (
          <LedgerEntryHash hash={hash} key={hash.hash} />
        ))}
      </div>
      <Tooltip tooltip={tooltip} />
    </div>
  )
}

export const LedgerListEntry = ({ ledger }: { ledger: Ledger }) => (
  <TooltipProvider>
    <LedgerListEntryInner ledger={ledger} />
  </TooltipProvider>
)
