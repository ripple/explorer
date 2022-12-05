import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { QueryClientProvider } from 'react-query'
import AccountsRouter from 'containers/Accounts/AccountsRouter'
import { updateViewportDimensions, onScroll, updateLanguage } from './actions'
import Ledgers from '../Ledgers'
import Header from '../Header'
import './app.scss'
import ledger from '../Ledger'
import transactions from '../Transactions'
import network from '../Network'
import validators from '../Validators'
import paystrings from '../PayStrings'
import token from '../Token'
import noMatch from '../NoMatch'
import { NFT } from '../NFT/NFT'
import SocketContext, { getSocket } from '../shared/SocketContext'
import { queryClient } from '../shared/QueryClient'

const App = (props) => {
  const { actions, location, match } = props

  const {
    params: { rippledUrl = null },
  } = match

  const socket = getSocket(rippledUrl)

  useEffect(() => {
    actions.updateViewportDimensions()
    window.addEventListener('resize', actions.updateViewportDimensions)
    window.addEventListener('scroll', actions.onScroll)

    return function cleanup() {
      window.removeEventListener('resize', actions.updateViewportDimensions)
      window.removeEventListener('scroll', actions.onScroll)

      socket.close()
      if (socket.p2pSocket !== undefined) {
        socket.p2pSocket.close()
      }
    }
  })

  const urlLink = rippledUrl ? `/${rippledUrl}` : ''

  /* START: Map legacy routes to new routes */
  if (location.hash && location.pathname === '/') {
    if (location.hash.indexOf('#/transactions/') === 0) {
      const identifier = location.hash.split('#/transactions/')[1]
      return <Redirect to={`/transactions/${identifier}`} />
    }
    if (location.hash.indexOf('#/graph/') === 0) {
      const identifier = location.hash.split('#/graph/')[1]
      return <Redirect to={`/accounts/${identifier}`} />
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
        <SocketContext.Provider value={socket}>
          <BrowserRouter basename={rippledUrl ?? ''}>
            <Header />
            <div className="content">
              <Switch>
                <Route exact path="/" component={Ledgers} />
                <Route exact path="/ledgers/:identifier" component={ledger} />
                <Route
                  exact
                  path="/accounts/:id?/:tab?/:assetType?"
                  component={AccountsRouter}
                />
                <Route
                  exact
                  path="/transactions/:identifier/:tab?"
                  component={transactions}
                />
                <Route exact path="/network/:tab?" component={network} />
                <Route
                  exact
                  path="/validators/:identifier/:tab?"
                  component={validators}
                />
                <Route exact path="/paystrings/:id?" component={paystrings} />
                <Route exact path="/token/:currency.:id" component={token} />
                <Route exact path="/nft/:id/:tab?" component={NFT} />
                <Route component={noMatch} />
              </Switch>
            </div>
          </BrowserRouter>
        </SocketContext.Provider>
      </QueryClientProvider>
    </div>
  )
}

App.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
    pathname: PropTypes.string,
  }).isRequired,
  actions: PropTypes.shape({
    updateViewportDimensions: PropTypes.func,
    onScroll: PropTypes.func,
    updateLanguage: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      rippledUrl: PropTypes.string,
    }),
  }).isRequired,
}

export default connect(
  (state) => ({
    language: state.app.language,
  }),
  (dispatch) => ({
    actions: bindActionCreators(
      {
        updateViewportDimensions,
        onScroll,
        updateLanguage,
      },
      dispatch,
    ),
  }),
)(App)
