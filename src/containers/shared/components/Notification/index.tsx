import { useEffect, useState } from 'react'
import './styles.scss'

type NotificationLevel = 'primary'
type NotificationUsage =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'dark'
  | 'light'
  | 'dark50'

export interface NotificationProps {
  autoDismiss?: boolean
  message: string
  action?: string
  level?: NotificationLevel
  delay?: number
  usage?: NotificationUsage
  className?: string
}

export const Notification = ({
  autoDismiss = false,
  delay = 5000,
  message,
  action,
  usage = 'default',
  level = 'primary',
  className,
}: NotificationProps) => {
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    if (autoDismiss) {
      setTimeout(() => {
        setDismissed(true)
      }, delay)
    }
  }, [autoDismiss, delay])

  const classNames = ['notification', usage, `${level}-theme`, className].join(
    ' ',
  )
  return !dismissed ? (
    <div className={classNames} data-testid="notification">
      <span>{message}</span>
      {action}
    </div>
  ) : null
}
