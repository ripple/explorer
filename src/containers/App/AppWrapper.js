import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateViewportDimensions, onScroll, updateLanguage } from './actions';
import Footer from '../Footer';
import Banner from '../Header/Banner'; // included here for spacing
import './app.css';
import App from './App';
import NoMatch from '../NoMatch';

const AppWrapper = props => {
  const { t } = props;
  const mode = process.env.REACT_APP_ENVIRONMENT;
  const path = mode === 'sidechain' ? '/:rippledUrl' : '/';
  return (
    <div className="app-wrapper">
      <Helmet>
        <meta name="description" content={t('app.meta.description')} />
        <meta name="author" content={t('app.meta.author')} />
      </Helmet>
      <Banner />
      <Switch>
        <Route path={path} component={App} />
        <Route component={NoMatch} />
      </Switch>
      <Footer />
    </div>
  );
};

AppWrapper.propTypes = {
  t: PropTypes.func.isRequired,
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
    )(AppWrapper)
  )
);
