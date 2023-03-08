import { useCallback } from 'react'

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
    // remove the custom mode's endpoint from the url path
    const url =
      (process.env.VITE_ENVIRONMENT === 'custom'
        ? `/${window.location.pathname.split('/').slice(2).join('/')}`
        : window.location.pathname) +
      window.location.search +
      window.location.hash

    this.track('screen_view', {
      ...fields,
      page_title: document.title,
      page_path: url,
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
