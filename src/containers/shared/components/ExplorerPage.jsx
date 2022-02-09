import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExplorerPage extends Component {
  constructor(props) {
    super(props);
    const { updateContext, match } = props;
    const rippledUrl = match.params.url;
    const urlLink = rippledUrl ? `/${rippledUrl}` : '';
    updateContext(rippledUrl, urlLink);
  }
}

ExplorerPage.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      url: PropTypes.string,
    }),
  }).isRequired,
  updateContext: PropTypes.func.isRequired,
};

export default ExplorerPage;
