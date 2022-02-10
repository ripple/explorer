import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './App';

const AppWrapper = () => {
  const mode = process.env.REACT_APP_ENVIRONMENT;
  const path = mode === 'sidechain' ? '/:rippledUrl' : '/';
  return (
    <Switch>
      <Route path={path} component={App} />
    </Switch>
  );
};

export default AppWrapper;
