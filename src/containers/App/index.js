import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateViewportDimensions, onScroll, updateLanguage } from './actions'
import Footer from '../Footer'
import Banner from '../Header/Banner' // included here for spacing
import './app.scss'
import App from './App'
import NoMatch from '../NoMatch'
import SidechainHome from '../SidechainHome'
import AppErrorBoundary from './AppErrorBoundary'

const AppWrapper = (props) => {
  const { t } = useTranslation()
  const mode = process.env.REACT_APP_ENVIRONMENT
  const path = mode === 'sidechain' ? '/:rippledUrl' : '/'
  return (
    <div className="app-wrapper">
      <AppErrorBoundary>
        <Helmet>
          <meta name="description" content={t('app.meta.description')} />
          <meta name="author" content={t('app.meta.author')} />
        </Helmet>
        <Banner />
        <Switch>
          <Route path={path} component={App} />
          {mode === 'sidechain' && <Route path="/" component={SidechainHome} />}
          <Route component={NoMatch} />
        </Switch>
        <Footer />
      </AppErrorBoundary>
    </div>
  )
}

AppWrapper.propTypes = {
  actions: PropTypes.shape({
    updateViewportDimensions: PropTypes.func,
    onScroll: PropTypes.func,
    updateLanguage: PropTypes.func,
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
)(AppWrapper)
