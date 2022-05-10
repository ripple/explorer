import 'intl';
import 'core-js/features/map';
import 'core-js/features/set';
import 'raf/polyfill';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { compose, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import localForage from 'localforage';
import { I18nextProvider } from 'react-i18next';
import reduxLogger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './rootReducer';
import { unregister } from './registerServiceWorker';
import './containers/shared/css/global.css';
import App from './containers/App';
import i18n from './i18n';

require('typeface-roboto');

let enhancers;
let store;
let persistor;

// Check if polyfill required for Promise
if (!Promise) {
  require('es6-promise/auto'); // eslint-disable-line global-require
}

const renderApp = () => {
  ReactDOM.render(
    <Suspense fallback="Loading">
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <App />
            </Router>
          </PersistGate>
        </Provider>
      </I18nextProvider>
    </Suspense>,
    document.getElementById('xrpl-explorer')
  );
};

const isDevelopment = process.env.NODE_ENV === 'development';
const persistConfig = {
  key: 'xrpl_explorer',
  storage: localForage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middlewarePackages = [thunk];
let middleware = applyMiddleware(...middlewarePackages);
if (isDevelopment) {
  localStorage.setItem('debug', 'xrpl-debug:*');
  middlewarePackages.push(reduxLogger);
  middleware = applyMiddleware(...middlewarePackages);
  enhancers = composeWithDevTools(middleware);
  store = createStore(persistedReducer, enhancers);
  persistor = persistStore(store);
  renderApp();
} else {
  localStorage.removeItem('debug');
  enhancers = compose(middleware);
  store = createStore(persistedReducer, enhancers);
  persistor = persistStore(store);
  renderApp();
}

unregister();
