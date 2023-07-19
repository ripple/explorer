import { useEffect, useState } from 'react'
import * as PropTypes from 'prop-types'
import './styles.scss'

const PRIMARY = 'primary'
const VALID_USAGES = [
  'default',
  'success',
  'warning',
  'danger',
  'dark',
  'light',
  'dark50',
]

export const Notification = ({
  autoDismiss = false,
  delay = 5000,
  message,
  action,
  usage = 'default',
  level = PRIMARY,
  className,
}) => {
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
    <div className={classNames}>
      <span>{message}</span>
      {action}
    </div>
  ) : null
}

Notification.defaultProps = {
  level: PRIMARY,
  usage: 'default',
  action: undefined,
  autoDismiss: false,
  delay: 5000,
  className: '',
}

Notification.propTypes = {
  level: PropTypes.oneOf([PRIMARY]),
  usage: PropTypes.oneOf(VALID_USAGES),
  message: PropTypes.string.isRequired,
  action: PropTypes.element,
  autoDismiss: PropTypes.bool,
  delay: PropTypes.number,
  className: PropTypes.string,
}
