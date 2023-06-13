import { Navigate } from 'react-router-dom'
import { FC } from 'react'
import { useLocation } from 'react-router'

export const LegacyRoutes: FC<{ basename: string }> = ({ basename }) => {
  const location = useLocation()

  /* START: Map legacy routes to new routes */
  if (location.hash && location.pathname === `${basename}/`) {
    if (location.hash.indexOf('#/transactions/') === 0) {
      const identifier = location.hash.split('#/transactions/')[1]
      return <Navigate to={`${basename}/transactions/${identifier}`} />
    }
    if (location.hash.indexOf('#/graph/') === 0) {
      const identifier = location.hash.split('#/graph/')[1]
      return <Navigate to={`${basename}/accounts/${identifier}`} />
    }
  }
  /* END: Map legacy routes to new routes */

  if (location.pathname === `${basename}/explorer`) {
    return <Navigate to={basename} />
  }

  if (location.pathname === `${basename}/ledgers`) {
    return <Navigate to={basename} />
  }

  if (location.pathname === `/network/upgrade_status`) {
    return <Navigate to="/network/upgrade-status" />
  }

  return null
}
