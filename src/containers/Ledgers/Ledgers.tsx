import { useEffect, useState } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import { CURRENCY_OPTIONS } from '../shared/transactionUtils'
import { localizeNumber } from '../shared/utils'
import Tooltip from '../shared/components/Tooltip'
import './css/ledgers.scss'
import DomainLink from '../shared/components/DomainLink'
import { Loader } from '../shared/components/Loader'
import { useIsOnline } from '../shared/SocketContext'
import { getAction, getCategory } from '../shared/components/Transaction'
import { TransactionActionIcon } from '../shared/components/TransactionActionIcon/TransactionActionIcon'
import { Legend } from './Legend'
import { LedgerHashComponent } from './LedgerHashView'
import { RouteLink } from '../shared/routing'
import { LEDGER_ROUTE, TRANSACTION_ROUTE, VALIDATOR_ROUTE } from '../App/routes'
import { useLanguage } from '../shared/hooks'
import { Ledger } from '../shared/useStreams'

const SIGMA = '\u03A3'

export type LedgersProps = React.PropsWithChildren<{
  ledgers: Record<number, Ledger>
  validators: Record<string, any>
  vhsData: any[]
  unlCount: number | undefined
  paused: boolean
}>

export const Ledgers = ({
  ledgers: ledgersProp,
  validators,
  vhsData,
  unlCount,
  paused,
}: LedgersProps) => {
  const [tooltip, setTooltip] = useState(null)
  const [selected, setSelected] = useState<string>('')
  const { t } = useTranslation()
  const language = useLanguage()
  const [ledgers, setLedgers] = useState<Record<number, Ledger>>({})

  useEffect(() => {
    if (!paused) setLedgers(ledgersProp)
  }, [ledgersProp, paused])

  const showTooltip = (mode, event, data) => {
    setTooltip({
      ...data,
      mode,
      v: mode === 'validator' && validators[data.pubkey],
      x: event.currentTarget.offsetLeft,
      y: event.currentTarget.offsetTop,
    })
  }

  const hideTooltip = () => setTooltip(null)

  const renderSelected = () => {
    const vhs = vhsData.filter((val) => val.signing_key === selected)[0] ?? {}
    return (
      <div className="selected-validator">
        {vhs.domain && <DomainLink domain={vhs.domain} />}
        <RouteLink
          to={VALIDATOR_ROUTE}
          params={{ identifier: selected.toString() }}
          className="pubkey"
        >
          {selected}
        </RouteLink>
      </div>
    )
  }

  const renderLedger = (ledger) => {
    const time = ledger.closeTime
      ? new Date(ledger.closeTime).toLocaleTimeString()
      : null
    const transactions = ledger.transactions || []

    return (
      <div className="ledger" key={ledger.index}>
        <div className="ledger-head">
          {renderLedgerIndex(ledger.index)}
          <div className="close-time">{time}</div>
          {renderTxnCount(ledger.txCount)}
          {renderFees(ledger.totalFees)}
          {ledger.transactions == null && <Loader />}
          <div className="transactions">
            {transactions.map(renderTransaction)}
          </div>
        </div>
        <div className="hashes">
          {ledger.hashes.map((hash) => (
            <LedgerHashComponent
              key={`${hash.hash}`}
              hash={hash}
              unlValidators={vhsData.filter((validation) => validation.unl)}
              unlCount={unlCount}
              // TODO: put this in a context
              vhsData={vhsData}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
        </div>
      </div>
    )
  }

  const renderLedgerIndex = (ledgerIndex) => {
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

  const renderTxnCount = (count) =>
    count !== undefined ? (
      <div className="txn-count">
        {t('txn_count')}:<b>{count.toLocaleString()}</b>
      </div>
    ) : null

  const renderFees = (d) => {
    const options = { ...CURRENCY_OPTIONS, currency: 'XRP' }
    const amount = localizeNumber(d, language, options)
    return d !== undefined ? (
      <div className="fees">
        {SIGMA} {t('fees')}:<b>{amount}</b>
      </div>
    ) : null
  }

  const renderTransaction = (tx) => (
    <RouteLink
      key={tx.hash}
      className={`txn tx-type tx-dot bg tx-category-${getCategory(
        tx.type,
      )} tx-action-${getAction(tx.type)} ${tx.result}`}
      onMouseOver={(e) => showTooltip('tx', e, tx)}
      onFocus={(_e) => {}}
      onMouseLeave={hideTooltip}
      to={TRANSACTION_ROUTE}
      params={{ identifier: tx.hash }}
    >
      <TransactionActionIcon type={tx.type} />
      <span>{tx.hash}</span>
    </RouteLink>
  )

  const { isOnline } = useIsOnline()

  return (
    <div className="ledgers">
      {isOnline ? (
        <>
          <Legend />
          <div className="control">{selected && renderSelected()}</div>
          <div className="ledger-list">
            {Object.values(ledgers).reverse().slice(0, 20).map(renderLedger)}{' '}
            <Tooltip t={t} language={language} data={tooltip} />
          </div>{' '}
        </>
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default withTranslation()(Ledgers)
