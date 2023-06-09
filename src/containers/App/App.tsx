import { useLocation, useParams } from 'react-router'
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import { AccountsRouter } from '../Accounts/AccountsRouter'
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

export const App = () => {
  const location = useLocation()
  const { rippledUrl = undefined } = useParams<{ rippledUrl: string }>()

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
                  <Route exact path={LEDGERS.path} component={Ledgers} />
                  <Route exact path={LEDGER.path} component={Ledger} />
                  <Route exact path={ACCOUNT.path} component={AccountsRouter} />
                  <Route
                    exact
                    path={TRANSACTION.path}
                    component={Transaction}
                  />
                  <Route exact path={NETWORK.path} component={Network} />
                  <Route exact path={VALIDATOR.path} component={Validator} />
                  <Route exact path={PAYSTRING.path} component={PayString} />
                  <Route exact path={TOKEN.path} component={token} />
                  <Route exact path={NFTRoute.path} component={NFT} />
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
