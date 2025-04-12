import { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from 'react-query'
import { unregister } from './registerServiceWorker'
import './containers/shared/css/global.scss'
import { AppWrapper } from './containers/App'
import i18n from './i18n'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

const renderApp = () => {
  ReactDOM.render(
    <Suspense fallback="Loading">
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Router>
            <AppWrapper />
          </Router>
        </I18nextProvider>
      </QueryClientProvider>
    </Suspense>,
    document.getElementById('xrpl-explorer'),
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
