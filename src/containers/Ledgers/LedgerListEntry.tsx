import { FocusEvent, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteLink } from '../shared/routing'
import { LEDGER_ROUTE } from '../App/routes'
import { Amount } from '../shared/components/Amount'
import { LedgerEntryHash } from './LedgerEntryHash'
import { LedgerEntryTransactions } from './LedgerEntryTransactions'
import {
  Tooltip,
  TooltipProvider,
  useTooltip,
} from '../shared/components/Tooltip'
import {
  Ledger,
  useStreams,
  getValidatedTime,
} from '../shared/components/Streams'
import { useVHSValidators } from '../shared/components/VHSValidators'

const SIGMA = '\u03A3'
const TOOLTIP_Y_OFFSET = 70

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
  const { tooltip, showTooltip, hideTooltip } = useTooltip()
  const { t } = useTranslation()
  const { metrics } = useStreams()
  const { unl, validators } = useVHSValidators()

  const closeTime = ledger.closeTime
    ? new Date(ledger.closeTime).toLocaleTimeString()
    : null

  // Prefer the hash rippled has confirmed canonical; fall back to the first
  // seen candidate (a second hashes[] entry only occurs on rare forks).
  const hashes = ledger.hashes ?? []
  const selectedHash = hashes.find((hash) => hash.validated) ?? hashes[0]

  const validatedTimeMillis = getValidatedTime(
    selectedHash?.validations ?? [],
    unl,
    metrics.quorum,
    validators,
    metrics.nUnl,
  )
  const validatedTime = validatedTimeMillis
    ? new Date(validatedTimeMillis).toLocaleTimeString()
    : null

  const renderHoverLabel = (label: string, descriptionKey: string) => {
    const showFieldTooltip = (
      e: MouseEvent<HTMLSpanElement> | FocusEvent<HTMLSpanElement>,
    ) => {
      const rect = e.currentTarget.getBoundingClientRect()
      showTooltip('text', e, t(descriptionKey, { defaultValue: '' }), {
        x: rect.left + rect.width / 2,
        y: rect.top - TOOLTIP_Y_OFFSET,
      })
    }
    return (
      <span
        className="hover-label"
        role="link"
        tabIndex={0}
        onMouseOver={showFieldTooltip}
        onFocus={showFieldTooltip}
        onMouseLeave={() => hideTooltip()}
        onBlur={() => hideTooltip()}
      >
        {label}:
      </span>
    )
  }

  return (
    <div className="ledger">
      <div className="ledger-head">
        <LedgerIndex ledgerIndex={ledger.index} />
        <div className="close-time">
          {renderHoverLabel(t('closed'), 'closed_description')}
          <b>{closeTime ?? '–'}</b>
        </div>
        <div className="validated-time">
          {renderHoverLabel(
            t('validated'),
            validatedTime
              ? 'validated_description'
              : 'validated_pending_description',
          )}
          <b>{validatedTime ?? '–'}</b>
        </div>
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
        {(ledger.hashes ?? []).map((hash) => (
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
