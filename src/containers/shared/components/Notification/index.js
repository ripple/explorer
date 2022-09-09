import * as React from 'react'
import * as PropTypes from 'prop-types'
import './styles.scss'

const PRIMARY = 'primary'
const SECONDARY = 'secondary'
const GHOST = 'ghost'
const VALID_USAGES = [
  'default',
  'success',
  'warning',
  'danger',
  'dark',
  'light',
  'dark50',
]

class Notification extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dismissed: props.dismissed || false,
    }
  }

  componentDidMount() {
    const { autoDismiss, delay } = this.props

    if (autoDismiss) {
      setTimeout(() => {
        this.setState({ dismissed: true })
      }, delay)
    }
  }

  render() {
    const {
      dismissed: propDismissed,
      message,
      action,
      usage,
      level,
      className,
    } = this.props
    const { dismissed: stateDismissed } = this.state
    const dismissed =
      propDismissed !== undefined ? propDismissed : stateDismissed
    const classNames = [
      'notification',
      usage,
      `${level}-theme`,
      className,
    ].join(' ')
    return !dismissed ? (
      <div className={classNames}>
        <span>{message}</span>
        {action}
      </div>
    ) : null
  }
}

Notification.defaultProps = {
  level: PRIMARY,
  usage: 'default',
  action: undefined,
  autoDismiss: false,
  dismissed: undefined,
  delay: 5000,
  className: '',
}

Notification.propTypes = {
  level: PropTypes.oneOf([PRIMARY, SECONDARY, GHOST]),
  usage: PropTypes.oneOf(VALID_USAGES),
  message: PropTypes.string.isRequired,
  action: PropTypes.element,
  autoDismiss: PropTypes.bool,
  dismissed: PropTypes.bool,
  delay: PropTypes.number,
  className: PropTypes.string,
}

export default Notification
