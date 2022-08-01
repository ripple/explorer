import { Component, ErrorInfo } from 'react'
import { ReactNodeLike } from 'prop-types'

import { analytics, ANALYTIC_TYPES } from '../shared/utils'

export type AppErrorBoundaryProps = { children: Array<ReactNodeLike> }
/**
 * Needs to be a class due to React not having a componentDidCatch hook equivalent.
 */
class AppErrorBoundary extends Component<AppErrorBoundaryProps> {
  componentDidCatch(error: Error, info: ErrorInfo) {
    analytics(ANALYTIC_TYPES.exception, {
      exDescription: `${error.toString()} -------->>>>>  ${
        info.componentStack
      }`,
    })
  }

  render() {
    const { children } = this.props

    return children
  }
}

export default AppErrorBoundary
