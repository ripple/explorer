import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import Validators from './Validators';
import Nodes from './Nodes';
import { analytics, ANALYTIC_TYPES } from '../shared/utils';
import './css/style.css';
import NoMatch from '../NoMatch';
import ExplorerPage from '../shared/components/ExplorerPage';

class Network extends ExplorerPage {
  componentDidMount() {
    const { t, match } = this.props;
    const { params } = match;
    document.title = `${t('xrpl_explorer')} | ${t('network')}`;
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'network',
      path: `/network/${params.tab || 'nodes'}`,
    });
  }

  renderUnderConstruction = () => {
    return (
      <div className="network-page">
        <NoMatch title="under_construction" hints={['come_back_later']} isError={false} />
      </div>
    );
  };

  render() {
    const { match } = this.props;
    const { params, path } = match;
    const { tab = 'nodes' } = params;
    const mode = process.env.REACT_APP_ENVIRONMENT;
    if (mode === 'nft_sandbox' || mode === 'sidechain') {
      return this.renderUnderConstruction();
    }
    // strips :url from the front and the tab info from the end
    const base = `/${path.split(':')[1].split('/')[1]}`;
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
