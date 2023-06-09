import { Switch, Route, Redirect } from 'react-router-dom'
import { useLocation } from 'react-router'
import { AccountsRouter } from '../Accounts/AccountsRouter'
import Ledgers from '../Ledgers'
import './app.scss'
import { Ledger } from '../Ledger'
import { Transaction } from '../Transactions'
import { Network } from '../Network'
import { Validator } from '../Validators'
import { PayString } from '../PayStrings'
import Token from '../Token'
import noMatch from '../NoMatch'
import { NFT } from '../NFT/NFT'
import { SocketProvider } from '../shared/SocketContext'
import { NetworkProvider } from '../shared/NetworkContext'
import {
  ACCOUNT,
  LEDGER,
  LEDGERS,
  NETWORK,
  PAYSTRING,
  TOKEN,
  TRANSACTION,
  VALIDATOR,
  NFT as NFTRoute,
} from './routes'
import { RouteDefinition } from '../shared/routing'

export const App = () => {
  const mode = process.env.VITE_ENVIRONMENT

  const location = useLocation()
  const rippledUrl = mode === 'custom' ? location.pathname.split('/')[1] : ''
  const urlLink = mode === 'custom' ? `/${rippledUrl}` : ''

  const updatePath = (path) => `${urlLink}${path}`

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

  const routes: [RouteDefinition, any][] = [
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
    <SocketProvider rippledUrl={rippledUrl}>
      <NetworkProvider rippledUrl={rippledUrl}>
        <div className="content">
          <Switch>
            {routes.map(([route, component]) => {
              return (
                <Route
                  key={route.path}
                  exact
                  path={updatePath(route.path)}
                  component={component}
                />
              )
            })}
            <Route component={noMatch} />
          </Switch>
        </div>
      </NetworkProvider>
    </SocketProvider>
  )
}
