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

export const AppWrapper = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const mode = process.env.VITE_ENVIRONMENT

  const rippledUrl =
    process.env.VITE_ENVIRONMENT === 'custom'
      ? `/${location.pathname.split('/')[1]}`
      : ''
  return (
    <HelmetProvider>
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
                <Route path="/*" element={<App />} />
                <Route element={<NoMatch />} />
              </Routes>
              <Footer />
            </div>
          </AppErrorBoundary>
        </div>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
