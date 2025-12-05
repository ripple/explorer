import { useTranslation } from 'react-i18next'
import { Tooltip, useTooltip } from '../shared/components/Tooltip'
import { renderXRP } from '../shared/utils'
import PauseIcon from '../shared/images/ic_pause.svg'
import ResumeIcon from '../shared/images/ic_play.svg'
import QuorumIcon from '../shared/images/quorum.svg'
import FeeIcon from '../shared/images/fee.svg'
import ClockIcon from '../shared/images/clock.svg'
import ClockAltIcon from '../shared/images/clock_2.svg'
import DecentralizedIcon from '../shared/images/decentralized.svg'
import CreditIcon from '../shared/images/finance_credit.svg'
import UserIcon from '../shared/images/user.svg'
import HoverIcon from '../shared/images/hover.svg'
import './css/ledgerMetrics.scss'
import { useIsOnline } from '../shared/SocketContext'
import { useLanguage } from '../shared/hooks'
import { useStreams } from '../shared/components/Streams'

const DEFAULTS = {
  load_fee: '--',
  txn_sec: '--',
  txn_ledger: '--',
  ledger_interval: '--',
  avg_fee: '--',
  quorum: '--',
  nUnl: [],
}

const TOOLTIP_Y_OFFSET = 70

export const LedgerMetrics = ({
  onPause,
  paused,
}: {
  onPause: any
  paused: boolean
}) => {
  const { metrics: suppliedData } = useStreams()
  const data = { ...DEFAULTS, ...suppliedData }
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

  const renderMetricIcon = (key: string) => {
    const classname = 'metrics-icon'
    switch (key) {
      case 'quorum':
        return <QuorumIcon className={classname} />
      case 'avg_fee':
        return <FeeIcon className={classname} />
      case 'ledger_interval':
        return <ClockIcon className={classname} />
      case 'txn_ledger':
        return <DecentralizedIcon className={classname} />
      case 'txn_sec':
        return <ClockAltIcon className={classname} />
      case 'load_fee':
        return <CreditIcon className={classname} />
      case 'nUnl':
        return <UserIcon className={classname} />
      default:
        return null
    }
  }

  const renderTextTooltip = (key: string) => (
    <HoverIcon
      className="hover"
      onMouseOver={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, t(`${key}_description`, { defaultValue: '' }), {
          x: rect.left + rect.width / 2,
          y: rect.top - TOOLTIP_Y_OFFSET,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )

  if (data.load_fee === '--') {
    data.load_fee = data.base_fee || '--'
  }
  delete data.base_fee
  const items = Object.keys(data)
    .map((key) => {
      let content: any = null

      if (data[key] === undefined && key !== 'nUnl') {
        content = '--'
      } else if (key.includes('fee') && !isNaN(data[key])) {
        content = renderXRP(data[key], language)
      } else if (key === 'ledger_interval' && data[key] !== '--') {
        content = `${data[key]} ${t('seconds_short')}`
      } else if (key === 'nUnl' && (!data[key] || data[key]?.length === 0)) {
        return null
      } else if (key === 'nUnl') {
        content = data[key]?.length
        return (
          <div className="cell" key={key}>
            <div className="label-wrapper">
              {renderMetricIcon(key)}
              <div className="label">
                <span
                  className="text"
                  role="link"
                  onMouseOver={(e) =>
                    showTooltip('nUnl', e, { nUnl: data.nUnl })
                  }
                  onMouseOut={() => hideTooltip()}
                  onFocus={() => {}}
                  onBlur={() => {}}
                  tabIndex={0}
                >
                  <a
                    key={`link ${key}`}
                    href="https://xrpl.org/negative-unl.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="n-unl-metric"
                  >
                    {t(key)}
                  </a>
                </span>

                {renderTextTooltip(key)}
              </div>
            </div>
            <span>{content}</span>
          </div>
        )
      } else {
        content = data[key]
      }

      return (
        <div className="cell" key={key}>
          <div className="label-wrapper">
            {renderMetricIcon(key)}
            <div className="label">
              <span className="text">
                {t(key, { defaultValue: 'load_fee' })}
              </span>
              {renderTextTooltip(key)}
            </div>
          </div>
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
