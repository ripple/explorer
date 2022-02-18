import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { XrplClient } from 'xrpl-client';
import { analytics, ANALYTIC_TYPES } from '../shared/utils';
import { updateViewportDimensions, onScroll, updateLanguage } from './actions';
import Ledgers from '../Ledgers';
import Header from '../Header';
import './app.css';
import ledger from '../Ledger';
import accounts from '../Accounts';
import transactions from '../Transactions';
import network from '../Network';
import validators from '../Validators';
import paystrings from '../PayStrings';
import token from '../Token';
import tokens from '../Tokens';
import noMatch from '../NoMatch';
import SocketContext from '../shared/SocketContext';

const MODE = process.env.REACT_APP_ENVIRONMENT;

class App extends Component {
  static componentDidCatch(error, info) {
    analytics(ANALYTIC_TYPES.exception, {
      exDescription: `${error.toString()} -------->>>>>  ${info.componentStack}`,
    });
  }

  constructor(props) {
    super(props);
    const { actions, i18n, language } = props;

    if (i18n.language !== language) {
      actions.updateLanguage(i18n.language);
    }

    props.actions.updateViewportDimensions();

    const { match } = this.props;
    const {
      params: { rippledUrl = null },
    } = match;
    const rippledHost = rippledUrl ?? process.env.REACT_APP_RIPPLED_HOST;
    this.socket = new XrplClient([`wss://${rippledHost}:${process.env.REACT_APP_RIPPLED_WS_PORT}`]);
  }

  componentDidMount() {
    const { actions } = this.props;
    window.addEventListener('resize', actions.updateViewportDimensions);
    window.addEventListener('scroll', actions.onScroll);

    this.socket.reinstate();
  }

  componentWillUnmount() {
    const { actions } = this.props;
    window.removeEventListener('resize', actions.updateViewportDimensions);
    window.removeEventListener('scroll', actions.onScroll);
    this.socket.close();
  }

  render() {
    const { location, match } = this.props;
    const {
      params: { rippledUrl = null },
    } = match;
    const urlLink = rippledUrl ? `/${rippledUrl}` : '';
    console.log(this.socket);

    /* START: Map legacy routes to new routes */
    if (location.hash && location.pathname === '/') {
      if (location.hash.indexOf('#/transactions/') === 0) {
        const identifier = location.hash.split('#/transactions/')[1];
        return <Redirect to={`/transactions/${identifier}`} />;
      }
      if (location.hash.indexOf('#/graph/') === 0) {
        const identifier = location.hash.split('#/graph/')[1];
        return <Redirect to={`/accounts/${identifier}`} />;
      }
    }
    /* END: Map legacy routes to new routes */

    if (location.pathname === `${urlLink}/explorer`) {
      return <Redirect to={urlLink} />;
    }

    if (location.pathname === `${urlLink}/ledgers`) {
      return <Redirect to={urlLink} />;
    }

    return (
      <div className="app">
        <SocketContext.Provider value={this.socket}>
          <BrowserRouter basename={rippledUrl ?? ''}>
            <Header />
            <div className="content">
              <Switch>
                {/* <Route exact path="/" component={Ledgers} /> */}
                <Route exact path="/ledgers/:identifier" component={ledger} />
                <Route exact path="/accounts/:id" component={accounts} />
                <Route exact path="/transactions/:identifier/:tab?" component={transactions} />
                {/* <Route exact path="/network/:tab?" component={network} />
                <Route exact path="/validators/:identifier?" component={validators} />
                <Route exact path="/validators/:identifier?/:tab" component={validators} /> */}
                <Route exact path="/paystrings/:id?" component={paystrings} />
                <Route exact path="/token/:currency.:id" component={token} />
                {MODE === 'mainnet' && <Route exact path="/tokens" component={tokens} />}
                <Route component={noMatch} />
              </Switch>
            </div>
          </BrowserRouter>
        </SocketContext.Provider>
      </div>
    );
  }
}

App.propTypes = {
  language: PropTypes.string.isRequired,
  i18n: PropTypes.shape({
    language: PropTypes.string,
    changeLanguage: PropTypes.func.isRequired,
  }).isRequired,
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
};

export default translate()(
  connect(
    state => ({
      language: state.app.language,
    }),
    dispatch => ({
      actions: bindActionCreators(
        {
          updateViewportDimensions,
          onScroll,
          updateLanguage,
        },
        dispatch
      ),
    })
  )(App)
);
