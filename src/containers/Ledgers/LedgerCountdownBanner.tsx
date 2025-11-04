import { useEffect, useState } from 'react'
import './css/ledgerCountdownBanner.scss'

const TARGET_LEDGER = 100_000_000
const SECONDS_PER_LEDGER = 3

interface CountdownTime {
  ledgersRemaining: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

const calculateCountdown = (currentLedger: number): CountdownTime => {
  const ledgersRemaining = Math.max(0, TARGET_LEDGER - currentLedger)
  const totalSeconds = ledgersRemaining * SECONDS_PER_LEDGER

  const days = Math.floor(totalSeconds / (24 * 60 * 60))
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  return {
    ledgersRemaining,
    days,
    hours,
    minutes,
    seconds,
  }
}

interface LedgerCountdownBannerProps {
  currentLedger?: number
}

export const LedgerCountdownBanner = ({
  currentLedger,
}: LedgerCountdownBannerProps) => {
  const [countdown, setCountdown] = useState<CountdownTime | null>(null)
  const [isReached, setIsReached] = useState(false)

  useEffect(() => {
    if (currentLedger === undefined) return

    const newCountdown = calculateCountdown(currentLedger)
    setCountdown(newCountdown)
    setIsReached(true)
  }, [currentLedger])

  if (!countdown) {
    return null
  }

  if (isReached) {
    return (
      <div className="ledger-countdown-banner celebration">
        <div className="banner-content">
          <span className="celebration-icon">🎉</span>
          <div className="banner-text">
            <h2>XRPL has reached 100 million ledgers!</h2>
            <p>A historic milestone for the XRP Ledger</p>
          </div>
          <span className="celebration-icon">🎉</span>
        </div>
      </div>
    )
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className="ledger-countdown-banner">
      <div className="banner-content">
        <span className="celebration-icon">🎊</span>
        <div className="banner-text">
          <h2>Countdown to 100 Million Ledgers</h2>
          <div className="countdown-info">
            <div className="ledger-count">
              <span className="label">Ledgers Remaining:</span>
              <span className="value">
                {countdown.ledgersRemaining.toLocaleString()}
              </span>
            </div>
            <div className="time-estimate">
              <span className="label">Estimated Time:</span>
              <span className="value">
                {countdown.days}d {formatNumber(countdown.hours)}h{' '}
                {formatNumber(countdown.minutes)}m{' '}
                {formatNumber(countdown.seconds)}s
              </span>
            </div>
          </div>
        </div>
        <span className="celebration-icon">🎊</span>
      </div>
    </div>
  )
}
