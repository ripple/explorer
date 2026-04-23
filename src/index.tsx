import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import { Buffer } from 'buffer'
import { unregister } from './registerServiceWorker'
import './containers/shared/css/global.scss'
import { AppWrapper } from './containers/App'
import i18n from './i18n'

window.Buffer = Buffer

const root = createRoot(document.getElementById('xrpl-explorer')!)

const renderApp = () => {
  root.render(
    <Suspense fallback="Loading">
      <I18nextProvider i18n={i18n}>
        <Router>
          <AppWrapper />
        </Router>
      </I18nextProvider>
    </Suspense>,
  )
}

const isDevelopment = process.env.NODE_ENV === 'development'

if (isDevelopment) {
  localStorage.setItem('debug', 'xrpl-debug:*')
  renderApp()
} else {
  localStorage.removeItem('debug')
  renderApp()
}

unregister()
