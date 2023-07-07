import { useLocation } from 'react-router'

export const legacyRedirect = (
  basename,
  location: ReturnType<typeof useLocation>,
): string | null => {
  if (location.hash && location.pathname === `${basename}/`) {
    if (location.hash.indexOf('#/transactions/') === 0) {
      const identifier = location.hash.split('#/transactions/')[1]
      return `${basename}/transactions/${identifier}`
    }
    if (location.hash.indexOf('#/graph/') === 0) {
      const identifier = location.hash.split('#/graph/')[1]
      return `${basename}/accounts/${identifier}`
    }
  }

  return null
}
