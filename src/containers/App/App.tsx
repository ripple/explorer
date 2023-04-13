import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router'
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { QueryClientProvider } from 'react-query'
import { AccountsRouter } from '../Accounts/AccountsRouter'
import { updateViewportDimensions, onScroll } from './actions'
import Ledgers from '../Ledgers'
import { Header } from '../Header'
import './app.scss'
import { Ledger } from '../Ledger'
import { Transaction } from '../Transactions'
import { Network } from '../Network'
import { Validator } from '../Validators'
import { PayString } from '../PayStrings'
import token from '../Token'
import noMatch from '../NoMatch'
import { NFT } from '../NFT/NFT'
import { SocketProvider } from '../shared/SocketContext'
import { queryClient } from '../shared/QueryClient'
import { NetworkProvider } from '../shared/NetworkContext'

export interface AppProps {
  actions: {
    updateViewportDimensions: () => {}
    onScroll: () => {}
  }
}

const App = ({ actions }: AppProps) => {
  const location = useLocation()
  const { rippledUrl = undefined } = useParams<{ rippledUrl: string }>()

  useEffect(() => {
    actions.updateViewportDimensions()
    window.addEventListener('resize', actions.updateViewportDimensions)
    window.addEventListener('scroll', actions.onScroll)

    return function cleanup() {
      window.removeEventListener('resize', actions.updateViewportDimensions)
      window.removeEventListener('scroll', actions.onScroll)
    }
  })

  const urlLink = rippledUrl ? `/${rippledUrl}` : ''

  /* START: Map legacy routes to new routes */
  if (location.hash && location.pathname === `${urlLink}/`) {
    if (location.hash.indexOf('#/transactions/') === 0) {
      const identifier = location.hash.split('#/transactions/')[1]
      return <Redirect to={`${urlLink}/transactions/${identifier}`} />
    }
    if (location.hash.indexOf('#/graph/') === 0) {
      const identifier = location.hash.split('#/graph/')[1]
      return <Redirect to={`${urlLink}/accounts/${identifier}`} />
    }
  }
  /* END: Map legacy routes to new routes */

  if (location.pathname === `${urlLink}/explorer`) {
    return <Redirect to={urlLink} />
  }

  if (location.pathname === `${urlLink}/ledgers`) {
    return <Redirect to={urlLink} />
  }

  if (location.pathname === `/network/upgrade_status`) {
    return <Redirect to="/network/upgrade-status" />
  }

  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <SocketProvider rippledUrl={rippledUrl}>
          <NetworkProvider rippledUrl={rippledUrl}>
            <BrowserRouter basename={rippledUrl ?? ''}>
              <Header />
              <div className="content">
                <Switch>
                  <Route exact path="/" component={Ledgers} />
                  <Route exact path="/ledgers/:identifier" component={Ledger} />
                  <Route
                    exact
                    path="/accounts/:id?/:tab?/:assetType?"
                    component={AccountsRouter}
                  />
                  <Route
                    exact
                    path="/transactions/:identifier?/:tab?"
                    component={Transaction}
                  />
                  <Route exact path="/network/:tab?" component={Network} />
                  <Route
                    exact
                    path="/validators/:identifier/:tab?"
                    component={Validator}
                  />
                  <Route exact path="/paystrings/:id?" component={PayString} />
                  <Route exact path="/token/:currency.:id" component={token} />
                  <Route exact path="/nft/:id/:tab?" component={NFT} />
                  <Route component={noMatch} />
                </Switch>
              </div>
            </BrowserRouter>
          </NetworkProvider>
        </SocketProvider>
      </QueryClientProvider>
    </div>
  )
}

export default connect(
  () => {},
  (dispatch) => ({
    actions: bindActionCreators(
      {
        updateViewportDimensions,
        onScroll,
      },
      dispatch,
    ),
  }),
)(App)
