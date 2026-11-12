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
import HoverIcon from '../shared/images/hover.svg'

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

  const renderFieldTooltip = (descriptionKey: string) => (
    <HoverIcon
      className="hover"
      onMouseOver={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, t(descriptionKey, { defaultValue: '' }), {
          x: rect.left + rect.width / 2,
          y: rect.top - TOOLTIP_Y_OFFSET,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )

  return (
    <div className="ledger">
      <div className="ledger-head">
        <LedgerIndex ledgerIndex={ledger.index} />
        <div className="close-time">
          <div className="label">
            {t('closed')}
            {renderFieldTooltip('closed_description')}
          </div>
          <div className="value">{closeTime ?? '–'}</div>
        </div>
        <div className="validated-time">
          <div className="label">
            {t('validated')}
            {renderFieldTooltip(
              validatedTime
                ? 'validated_description'
                : 'validated_pending_description',
            )}
          </div>
          <div className="value">{validatedTime ?? '–'}</div>
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
