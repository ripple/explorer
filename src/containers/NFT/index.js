import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import NoMatch from '../NoMatch';
import NFTHeader from './NFTHeader';
import './styles.css';
import { analytics, ANALYTIC_TYPES, NOT_FOUND, BAD_REQUEST } from '../shared/utils';

const IS_MAINNET = process.env.REACT_APP_ENVIRONMENT === 'mainnet';

const ERROR_MESSAGES = {};
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'account_not_found',
  hints: ['check_account_id'],
};
ERROR_MESSAGES[BAD_REQUEST] = {
  title: 'invalid_xrpl_address',
  hints: ['check_account_id'],
};
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
};

const getErrorMessage = error => ERROR_MESSAGES[error] || ERROR_MESSAGES.default;

class NFT extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { match } = nextProps;
    return {
      tokenId: match.params.id,
      prevId: prevState && prevState.tokenId,
    };
  }

  static renderError(error) {
    const message = getErrorMessage(error);
    return (
      <div className="token-page">
        <NoMatch title={message.title} hints={message.hints} />
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    analytics(ANALYTIC_TYPES.pageview, { title: 'NFT', path: '/NFT/:id' });
  }

  componentWillUnmount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { t, error, match } = this.props;
    const { prevId } = this.state;
    const tokenId = match.params.id || '';
    const showError = tokenId === prevId && error;

    document.title = `${t('xrpl_explorer')} | ${tokenId.substr(0, 12)}...`;

    return showError ? (
      NFT.renderError(error)
    ) : (
      <div className="token-page">
        {tokenId && <NFTHeader tokenId={tokenId} t={t} />}
        {!tokenId && (
          <div style={{ textAlign: 'center', fontSize: '14px' }}>
            <h2>Enter an account ID in the search box</h2>
          </div>
        )}
      </div>
    );
  }
}

NFT.propTypes = {
  t: PropTypes.func.isRequired,
  error: PropTypes.number,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

NFT.defaultProps = {
  error: null,
};

export default connect(state => ({
  width: state.app.width,
  error: state.NFTHeader.error,
}))(withTranslation()(NFT));
