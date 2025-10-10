import { FC } from 'react'
import { convertRippleDate } from '../../../../rippled/lib/convertRippleDate'
import './styles.scss'

interface ResponsiveTimestampProps {
  timestamp: number
}

export const ResponsiveTimestamp: FC<ResponsiveTimestampProps> = ({ timestamp }) => {
  const date = new Date(convertRippleDate(timestamp))

  // Desktop format: "Dec 15, 2023, 10:30:45 AM"
  const desktopFormat = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  // Mobile format: "12/15/2023 10:30"
  const mobileFormat = date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <div className="responsive-timestamp">
      <span className="desktop-timestamp">{desktopFormat}</span>
      <span className="mobile-timestamp">{mobileFormat}</span>
    </div>
  )
}
