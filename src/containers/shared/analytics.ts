import { useCallback, useEffect } from 'react'
import { useLocation } from 'react-router'

/* eslint-disable camelcase -- GA uses underscores for the names */
export type AnalyticsEventNames =
  | 'exception'
  | 'screen_view'
  | 'search'
  | 'mobile_menu'
  | 'network_switch'
  | 'load_more'
  | 'not_found'

export interface AnalyticsFields {
  network?: string
  entrypoint?: string
  transaction_type?: string
  transaction_category?: string
  transaction_action?: string
  tec_code?: string
  account_id?: string
  issuer?: string
  currency_code?: string
  asset1?: string
  asset2?: string
  nftoken_id?: string
  search_term?: string
  search_category?: string
  validator?: string
  mpt_issuance_id?: string

  description?: string
  page_title?: string
  page_location?: string
  page_path?: string
}
/* eslint-enable camelcase */

class Analytics {
  globals: any = {}

  setGlobals(newGlobals) {
    Object.assign(this.globals, newGlobals)
  }

  track(event: AnalyticsEventNames, fields: AnalyticsFields) {
    window.dataLayer.push({ ...this.globals, ...fields, event })
  }

  trackException(description: string) {
    this.track('exception', { description })
  }

  trackScreenLoaded(fields?: AnalyticsFields) {
    this.track('screen_view', {
      ...fields,
      page_title: document.title,
    })
  }
}

export const analytics = new Analytics()

export const useAnalytics = () => {
  const setGlobals = useCallback((newGlobals) => {
    analytics.setGlobals(newGlobals)
  }, [])

  const track = useCallback(
    (...args: Parameters<Analytics['track']>) => analytics.track(...args),
    [],
  )

  const trackException = useCallback((description: string) => {
    analytics.trackException(description)
  }, [])

  const trackScreenLoaded = useCallback((fields?: AnalyticsFields) => {
    analytics.trackScreenLoaded(fields)
  }, [])

  return {
    setGlobals,
    track,
    trackException,
    trackScreenLoaded,
  }
}

/**
 * Sets up a hook to populate page_path from `useLocation`.  This allows for via various routers.
 * @constructor
 */
export const AnalyticsSetPath = () => {
  const { setGlobals } = useAnalytics()
  const { hash, pathname, search } = useLocation()
  useEffect(() => {
    // remove the custom mode's endpoint from the url path
    const url =
      (process.env.VITE_ENVIRONMENT === 'custom'
        ? `/${pathname.split('/').slice(2).join('/')}`
        : pathname) +
      search +
      hash

    setGlobals({
      page_path: url,
    })
  }, [hash, pathname, search, setGlobals])

  return null
}
