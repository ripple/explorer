import { useTranslation } from 'react-i18next'
import { Tooltip, useTooltip } from '../shared/components/Tooltip'
import { renderXRP } from '../shared/utils'
import PauseIcon from '../shared/images/ic_pause.svg'
import ResumeIcon from '../shared/images/ic_play.svg'
import './css/ledgerMetrics.scss'
import { useIsOnline } from '../shared/SocketContext'
import { useLanguage } from '../shared/hooks'

const DEFAULTS = {
  load_fee: '--',
  txn_sec: '--',
  txn_ledger: '--',
  ledger_interval: '--',
  avg_fee: '--',
  quorum: '--',
  nUnl: [],
}

export const LedgerMetrics = ({
  data,
  onPause,
  paused,
}: {
  data: any
  onPause: any
  paused: boolean
}) => {
  data = { ...DEFAULTS, ...data }
  const { tooltip, showTooltip, hideTooltip } = useTooltip()
  const { t } = useTranslation()
  const isOnline = useIsOnline()
  const language = useLanguage()

  const renderPause = () => {
    const Icon = paused ? ResumeIcon : PauseIcon
    const text = paused ? 'resume' : 'pause'

    return (
      <div
        tabIndex={0}
        role="button"
        className="pause-resume"
        onClick={onPause}
        onKeyUp={onPause}
      >
        <Icon className="icon" alt={t(text)} />
        <span>{t(text)}</span>
      </div>
    )
  }

  if (data.load_fee === '--') {
    data.load_fee = data.base_fee || '--'
  }
  delete data.base_fee
  const items = Object.keys(data)
    .map((key) => {
      let content: any = null

      let className = 'label'
      if (data[key] === undefined && key !== 'nUnl') {
        content = '--'
      } else if (key.includes('fee') && !isNaN(data[key])) {
        content = renderXRP(data[key], language)
      } else if (key === 'ledger_interval' && data[key] !== '--') {
        content = `${data[key]} ${t('seconds_short')}`
      } else if (key === 'nUnl' && data[key]?.length === 0) {
        return null
      } else if (key === 'nUnl') {
        content = data[key].length
        className = 'label n-unl-metric'
        return (
          <div
            role="link"
            className="cell"
            onFocus={() => {}}
            onBlur={() => {}}
            onMouseOver={(e) => showTooltip('nUnl', e, { nUnl: data.nUnl })}
            onMouseOut={() => hideTooltip()}
            tabIndex={0}
            key={key}
          >
            <a
              key={`link ${key}`}
              href="https://xrpl.org/negative-unl.html"
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {t(key)}
            </a>
            <span>{content}</span>
          </div>
        )
      } else {
        content = data[key]
      }

      return (
        <div className="cell" key={key}>
          <div className={className}>{t(key)}</div>
          <span>{content}</span>
        </div>
      )
    })
    .reverse()

  return (
    <div className="metrics-control">
      {isOnline && (
        <>
          <div className="control">{renderPause()}</div>
          <div className="metrics">{items}</div>
          <Tooltip tooltip={tooltip} />
        </>
      )}
    </div>
  )
}
