import { useState } from 'react'
import { useQuery } from 'react-query'
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

  useQuery(
    ['notification-auto-dismiss', autoDismiss, delay],
    () => {
      if (autoDismiss) {
        setTimeout(() => {
          setDismissed(true)
        }, delay)
      }
      return null
    },
    {
      cacheTime: 0,
    },
  )

  const classNames = ['notification', usage, `${level}-theme`, className].join(
    ' ',
  )
  return !dismissed ? (
    <div className={classNames}>
      <span>{message}</span>
      {action}
    </div>
  ) : null
}
