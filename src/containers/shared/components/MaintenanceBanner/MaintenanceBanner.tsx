import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './styles.scss'

// To schedule a maintenance window, set these to ISO 8601 UTC timestamps.
// Set both to null to disable the banner. The banner automatically hides
// once `now` passes MAINTENANCE_END.
const MAINTENANCE_START: string | null = '2026-05-15T01:00:00Z'
const MAINTENANCE_END: string | null = '2026-05-15T01:30:00Z'

interface TimeParts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const splitDuration = (totalMs: number): TimeParts => {
  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000))
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

const pad = (n: number) => n.toString().padStart(2, '0')

const formatCountdown = ({ days, hours, minutes, seconds }: TimeParts) => {
  if (days > 0) {
    return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
  }
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
}

const formatWindow = (startMs: number, endMs: number, locale: string) => {
  const dateFmt = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const timeFmt = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })
  const start = new Date(startMs)
  const end = new Date(endMs)
  return `${dateFmt.format(start)}, ${timeFmt.format(start)}–${timeFmt.format(end)} UTC`
}

interface MaintenanceBannerProps {
  // Override defaults for testing. Production code should not pass these.
  start?: string | null
  end?: string | null
}

export const MaintenanceBanner = ({
  start = MAINTENANCE_START,
  end = MAINTENANCE_END,
}: MaintenanceBannerProps = {}) => {
  const { t, i18n } = useTranslation()
  const startMs = start ? Date.parse(start) : NaN
  const endMs = end ? Date.parse(end) : NaN
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (Number.isNaN(endMs) || Date.now() >= endMs) {
      return undefined
    }
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [endMs])

  if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
    return null
  }
  if (now >= endMs) {
    return null
  }

  const durationMin = Math.round((endMs - startMs) / 60_000)
  const windowLabel = formatWindow(startMs, endMs, i18n.language)
  const beforeStart = now < startMs

  return (
    <div className="maintenance-banner" role="status">
      <div className="maintenance-banner__content">
        <span className="maintenance-banner__icon" aria-hidden="true">
          🛠️
        </span>
        <div className="maintenance-banner__text">
          {t('maintenance_banner.notice', {
            window: windowLabel,
            duration: durationMin,
          })}
          {beforeStart && (
            <>
              {' '}
              {t('maintenance_banner.countdown_prefix')}{' '}
              <span className="maintenance-banner__countdown">
                {formatCountdown(splitDuration(startMs - now))}
              </span>
              .
            </>
          )}
        </div>
      </div>
    </div>
  )
}
