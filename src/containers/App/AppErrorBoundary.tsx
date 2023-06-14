import { Component, ErrorInfo, PropsWithChildren } from 'react'

import { analytics } from '../shared/analytics'

export type AppErrorBoundaryProps = PropsWithChildren<{}>
/**
 * Needs to be a class due to React not having a componentDidCatch hook equivalent.
 */
class AppErrorBoundary extends Component<AppErrorBoundaryProps> {
  componentDidCatch(error: Error, info: ErrorInfo) {
    analytics.trackException(
      `${error.toString()} -------->>>>>  ${info.componentStack}`,
    )
  }

  render() {
    const { children } = this.props

    return children
  }
}

export default AppErrorBoundary
