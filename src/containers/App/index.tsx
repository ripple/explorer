import { Route, useLocation, Routes } from 'react-router'
import { Navigate } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from 'react-query'
import { useTranslation } from 'react-i18next'
import Footer from '../Footer'
import './app.scss'

import { App } from './App'
import CustomNetworkHome from '../CustomNetworkHome'
import AppErrorBoundary from './AppErrorBoundary'
import NoMatch from '../NoMatch'
import { queryClient } from '../shared/QueryClient'
import { AnalyticsSetPath, useAnalytics } from '../shared/analytics'
import { RouteDefinition } from '../shared/routing'
import {
  ACCOUNT_ROUTE,
  LEDGER_ROUTE,
  LEDGERS_ROUTE,
  NETWORK_ROUTE,
  NFT_ROUTE,
  PAYSTRING_ROUTE,
  TOKEN_ROUTE,
  TRANSACTION_ROUTE,
  VALIDATOR_ROUTE,
  AMENDMENTS_ROUTE,
} from './routes'
import Ledgers from '../Ledgers'
import { Ledger } from '../Ledger'
import { AccountsRouter } from '../Accounts/AccountsRouter'
import { Transaction } from '../Transactions'
import { Network } from '../Network'
import { Validator } from '../Validators'
import { PayString } from '../PayStrings'
import Token from '../Token'
import { NFT } from '../NFT/NFT'
import { legacyRedirect } from './legacyRedirects'
import { useCustomNetworks } from '../shared/hooks'
import { Amendments } from '../Amendments'

export const AppWrapper = () => {
  const mode = process.env.VITE_ENVIRONMENT

  const { setGlobals } = useAnalytics()
  const [customNetworks = [], setCustomNetworks] = useCustomNetworks()
  const { t } = useTranslation()
  const location = useLocation()

  setGlobals({
    network: mode,
  })
  const rippledUrl = mode === 'custom' ? location.pathname.split('/')[1] : ''
  const basename = mode === 'custom' ? `/${rippledUrl}` : ''
  const updatePath = (path) => `${basename}${path}`

  if (rippledUrl && !customNetworks.includes(rippledUrl)) {
    setCustomNetworks(customNetworks.concat([rippledUrl]).sort())
  }

  // Defined here rather than ./routes to avoid circular dependencies when using RouteDefinitions with <RouteLink>.
  const routes: [RouteDefinition<any>, any][] = [
    [LEDGERS_ROUTE, Ledgers],
    [LEDGER_ROUTE, Ledger],
    [ACCOUNT_ROUTE, AccountsRouter],
    [TRANSACTION_ROUTE, Transaction],
    [NETWORK_ROUTE, Network],
    [AMENDMENTS_ROUTE, Amendments],
    [VALIDATOR_ROUTE, Validator],
    [PAYSTRING_ROUTE, PayString],
    [TOKEN_ROUTE, Token],
    [NFT_ROUTE, NFT],
  ]

  const redirect = legacyRedirect(basename, location)

  return (
    <HelmetProvider>
      <AnalyticsSetPath />
      <QueryClientProvider client={queryClient}>
        <div className="app-wrapper">
          <AppErrorBoundary>
            <Helmet
              defaultTitle={t('xrpl_explorer')}
              titleTemplate={`${t('xrpl_explorer')} | %s`}
            >
              <meta name="description" content={t('app.meta.description')} />
              <meta name="author" content={t('app.meta.author')} />
            </Helmet>
            <div className="app">
              <Routes>
                {/* Start: Redirects */}
                {/* Ensures redirects happen without loading other routes. Specifically for hash routes */}
                {redirect && (
                  <Route path="" element={<Navigate to={redirect} replace />} />
                )}
                <Route
                  path={updatePath('/explorer')}
                  element={<Navigate to={updatePath('/')} replace />}
                />
                <Route
                  path={updatePath('/ledgers')}
                  element={<Navigate to={updatePath('/')} replace />}
                />
                {/* End: Redirects */}
                {mode === 'custom' && (
                  <Route path="/" element={<CustomNetworkHome />} />
                )}
                <Route element={<App rippledUrl={rippledUrl} />}>
                  {routes.map(([route, Component]) => (
                    <Route
                      key={route.path}
                      path={updatePath(route.path)}
                      element={<Component />}
                    />
                  ))}
                  <Route path="*" element={<NoMatch />} />
                </Route>
                \{' '}
              </Routes>
              <Footer />
            </div>
          </AppErrorBoundary>
        </div>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
