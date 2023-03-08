import { Switch, Route } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Footer from '../Footer'
import './app.scss'
import { App } from './App'
import NoMatch from '../NoMatch'
import CustomNetworkHome from '../CustomNetworkHome'
import AppErrorBoundary from './AppErrorBoundary'
import { useAnalytics } from '../shared/analytics'

export const AppWrapper = () => {
  const { t } = useTranslation()
  const mode = process.env.VITE_ENVIRONMENT
  const path = mode === 'custom' ? '/:rippledUrl' : '/'
  const { setGlobals } = useAnalytics()

  setGlobals({
    network: mode,
  })
  return (
    <HelmetProvider>
      <div className="app-wrapper">
        <AppErrorBoundary>
          <Helmet titleTemplate={`${t('xrpl_explorer')} | %s`} defer={false}>
            <meta name="description" content={t('app.meta.description')} />
            <meta name="author" content={t('app.meta.author')} />
          </Helmet>
          <Switch>
            <Route path={path} component={App} />
            {mode === 'custom' && (
              <Route path="/" component={CustomNetworkHome} />
            )}
            <Route component={NoMatch} />
          </Switch>
          <Footer />
        </AppErrorBoundary>
      </div>
    </HelmetProvider>
  )
}
