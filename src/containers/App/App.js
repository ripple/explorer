import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { XrplClient } from 'xrpl-client'
import { updateViewportDimensions, onScroll, updateLanguage } from './actions'
import Ledgers from '../Ledgers'
import Header from '../Header'
import './app.scss'
import ledger from '../Ledger'
import accounts from '../Accounts'
import transactions from '../Transactions'
import network from '../Network'
import validators from '../Validators'
import paystrings from '../PayStrings'
import token from '../Token'
import noMatch from '../NoMatch'
import SocketContext from '../shared/SocketContext'

const MODE = process.env.REACT_APP_ENVIRONMENT

const App = (props) => {
  const { actions, location, match } = props

  const {
    params: { rippledUrl = null },
  } = match
  const rippledHost = rippledUrl ?? process.env.REACT_APP_RIPPLED_HOST
  const wsUrls = []
  if (rippledHost.includes(':')) {
    wsUrls.push(`wss://${rippledHost}`)
  } else {
    wsUrls.push.apply(wsUrls, [
      `wss://${rippledHost}:${process.env.REACT_APP_RIPPLED_WS_PORT}`,
      `wss://${rippledHost}:443`,
    ])
  }
  const socket = new XrplClient(wsUrls)
  const hasP2PSocket =
    process.env.REACT_APP_P2P_RIPPLED_HOST != null &&
    process.env.REACT_APP_P2P_RIPPLED_HOST !== ''
  socket.p2pSocket = hasP2PSocket
    ? new XrplClient([
        `wss://${process.env.REACT_APP_P2P_RIPPLED_HOST}:${process.env.REACT_APP_RIPPLED_WS_PORT}`,
      ])
    : undefined

  useEffect(() => {
    actions.updateViewportDimensions()
    window.addEventListener('resize', actions.updateViewportDimensions)
    window.addEventListener('scroll', actions.onScroll)

    return function cleanup() {
      window.removeEventListener('resize', actions.updateViewportDimensions)
      window.removeEventListener('scroll', actions.onScroll)

      socket.close()
      if (hasP2PSocket) {
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

  return (
    <div className="app">
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
                component={accounts}
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
              <Route component={noMatch} />
            </Switch>
          </div>
        </BrowserRouter>
      </SocketContext.Provider>
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
