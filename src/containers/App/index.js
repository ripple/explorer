import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { analytics, ANALYTIC_TYPES } from '../shared/utils';
import { updateViewportDimensions, onScroll, updateLanguage } from './actions';
import Ledgers from '../Ledgers';
import Header from '../Header';
import Footer from '../Footer';
import Banner from '../Header/Banner'; // included here for spacing
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
import UrlContext from '../shared/urlContext';

const MODE = process.env.REACT_APP_ENVIRONMENT;

function renderComponent(routerProps, page) {
  const rippledUrl = routerProps.match.params.url;
  const urlLink = rippledUrl ? `/${rippledUrl}` : '';
  const PageComponent = page;
  return (
    <UrlContext.Provider value={{ rippledUrl, urlLink }}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading -- needed for component */}
      <PageComponent {...routerProps} />;
    </UrlContext.Provider>
  );
}

function generateRoute(path, component) {
  return (
    <Route exact path={path} component={routerProps => renderComponent(routerProps, component)} />
  );
}

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
  }

  componentDidMount() {
    const { actions } = this.props;
    window.addEventListener('resize', actions.updateViewportDimensions);
    window.addEventListener('scroll', actions.onScroll);
  }

  componentWillUnmount() {
    const { actions } = this.props;
    window.removeEventListener('resize', actions.updateViewportDimensions);
    window.removeEventListener('scroll', actions.onScroll);
  }

  render() {
    const { t, location } = this.props;

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

    if (location.pathname === '/explorer') {
      return <Redirect to="/" />;
    }

    if (location.pathname === '/ledgers') {
      return <Redirect to="/" />;
    }

    const urlPrefix = MODE === 'sidechain' ? '/:url' : '';

    return (
      <div className="app">
        <Helmet>
          <meta name="description" content={t('app.meta.description')} />
          <meta name="author" content={t('app.meta.author')} />
        </Helmet>
        <Banner />
        <Header />
        <div className="content">
          <Switch>
            <Route exact path={`${urlPrefix}/`} component={Ledgers} />
            {generateRoute(`${urlPrefix}/ledgers/:identifier`, ledger)}
            <Route exact path={`${urlPrefix}/accounts/:id?`} component={accounts} />
            {generateRoute(`${urlPrefix}/transactions/:identifier/:tab?`, transactions)}
            <Route
              exact
              path={`${urlPrefix}/network/:tab?`}
              component={routerProps => renderComponent(routerProps, network)}
            />
            <Route exact path={`${urlPrefix}/validators/:identifier?`} component={validators} />
            <Route
              exact
              path={`${urlPrefix}/validators/:identifier?/:tab`}
              component={validators}
            />
            <Route exact path={`${urlPrefix}/paystrings/:id?`} component={paystrings} />
            <Route exact path={`${urlPrefix}/token/:currency.:id`} component={token} />
            {MODE === 'mainnet' && <Route exact path="/tokens" component={tokens} />}
            <Route component={noMatch} />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  t: PropTypes.func.isRequired,
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
};

export default withRouter(
  translate()(
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
  )
);
