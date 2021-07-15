import React, { Component } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import Validators from './Validators';
import Nodes from './Nodes';
import { analytics, ANALYTIC_TYPES } from '../shared/utils';
import './css/style.css';

class Network extends Component {
  componentDidMount() {
    const { t, match } = this.props;
    const { params } = match;
    document.title = `${t('xrpl_explorer')} | ${t('network')}`;
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'network',
      path: `/network/${params.tab || 'nodes'}`,
    });
  }

  render() {
    const { match } = this.props;
    const { params, path } = match;
    const { tab = 'nodes' } = params;
    const base = path.split('/:')[0];
    return tab === 'nodes' ? <Nodes path={base} /> : <Validators path={base} />;
  }
}

Network.propTypes = {
  t: PropTypes.func.isRequired,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      identifier: PropTypes.string,
      tab: PropTypes.string,
    }),
  }).isRequired,
};

export default translate()(Network);
