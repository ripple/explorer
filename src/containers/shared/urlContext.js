import React from 'react';

const UrlContext = React.createContext({
  rippledUrl: undefined,
  urlLink: '',
  editContext: (rippledUrl, urlLink) => null,
});

export default UrlContext;
