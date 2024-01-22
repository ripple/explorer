import { useTranslation, withTranslation } from 'react-i18next'
import { useState } from 'react'
import Tooltip from '../shared/components/Tooltip'
import { renderXRP } from '../shared/utils'
import PauseIcon from '../shared/images/ic_pause.svg'
import ResumeIcon from '../shared/images/ic_play.svg'
import './css/ledgerMetrics.scss'
import { useIsOnline } from '../shared/SocketContext'
import { useLanguage } from '../shared/hooks'

export type LedgerMetricsProps = React.PropsWithChildren<{
  data: Record<string, any>
  onPause: () => void
  paused: boolean
}>

export const LedgerMetrics = ({
  data,
  onPause,
  paused,
}: LedgerMetricsProps) => {
  const [tooltip, setTooltip] = useState<any>(null)
  const { t } = useTranslation()
  const language = useLanguage()

  const showTooltip = (event) => {
    setTooltip({
      nUnl: data.nUnl,
      mode: 'nUnl',
      x: event.currentTarget.offsetLeft,
      y: event.currentTarget.offsetTop,
    })
  }

  const hideTooltip = () => setTooltip(null)

  function renderPause() {
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

  const metrics = { ...data }
  if (metrics.load_fee === '--') {
    metrics.load_fee = metrics.base_fee || '--'
  }
  delete metrics.base_fee
  const items = Object.keys(metrics)
    .map((key: any) => {
      let content: string | null = null

      let className = 'label'
      if (metrics[key] === undefined && key !== 'nUnl') {
        content = '--'
      } else if (key.includes('fee') && !isNaN(metrics[key])) {
        content = renderXRP(metrics[key], language)
      } else if (key === 'ledger_interval' && metrics[key] !== '--') {
        content = `${metrics[key]} ${t('seconds_short')}`
      } else if (key === 'nUnl' && metrics[key]?.length === 0) {
        return null
      } else if (key === 'nUnl') {
        content = metrics[key].length
        className = 'label n-unl-metric'
        return (
          <div
            role="link"
            className="cell"
            onFocus={() => {}}
            onBlur={() => {}}
            onMouseOver={(e) => showTooltip(e)}
            onMouseOut={hideTooltip}
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

  const isOnline = useIsOnline()

  return (
    <div className="metrics-control">
      {isOnline && (
        <>
          <div className="control">{renderPause()}</div>
          <div className="metrics">{items}</div>
          <Tooltip t={t} language={language} data={tooltip} />
        </>
      )}
    </div>
  )
}

export default withTranslation()(LedgerMetrics)
