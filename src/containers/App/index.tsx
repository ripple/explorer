import { Route, useLocation, Routes } from 'react-router'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from 'react-query'
import { useTranslation } from 'react-i18next'
import Footer from '../Footer'
import './app.scss'

import { App } from './App'
import CustomNetworkHome from '../CustomNetworkHome'
import AppErrorBoundary from './AppErrorBoundary'
import NoMatch from '../NoMatch'
import { Header } from '../Header'
import { queryClient } from '../shared/QueryClient'
import { RouteDefinition } from '../shared/routing'
import {
  ACCOUNT,
  LEDGER,
  LEDGERS,
  NETWORK,
  NFT as NFTRoute,
  PAYSTRING,
  TOKEN,
  TRANSACTION,
  VALIDATOR,
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
import { LegacyRoutes } from './LegacyRoutes'

export const AppWrapper = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const mode = process.env.VITE_ENVIRONMENT

  const rippledUrl = mode === 'custom' ? location.pathname.split('/')[1] : ''
  const basename = mode === 'custom' ? `/${rippledUrl}` : ''
  const updatePath = (path) => `${basename}${path}`

  // Defined here rather than ./routes to avoid circular dependencies when using RouteDefinitions with <RouteLink>.
  const routes: [RouteDefinition<any>, any][] = [
    [LEDGERS, Ledgers],
    [LEDGER, Ledger],
    [ACCOUNT, AccountsRouter],
    [TRANSACTION, Transaction],
    [NETWORK, Network],
    [VALIDATOR, Validator],
    [PAYSTRING, PayString],
    [TOKEN, Token],
    [NFTRoute, NFT],
  ]

  return (
    <HelmetProvider>
      <LegacyRoutes basename={basename} />
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
              <Header inNetwork={!!(mode !== 'custom' || rippledUrl)} />
              <Routes>
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
              </Routes>
              <Footer />
            </div>
          </AppErrorBoundary>
        </div>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
