import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useTranslation, withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NoMatch from '../NoMatch';
import NFTHeader from './NFTHeader';
import './styles.css';
import { analytics, ANALYTIC_TYPES, NOT_FOUND, BAD_REQUEST } from '../shared/utils';

const ERROR_MESSAGES = {};
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'assets.no_nfts_message',
  hints: ['check_nft_id'],
};
ERROR_MESSAGES[BAD_REQUEST] = {
  title: 'invalid_xrpl_address',
  hints: ['check_nft_id'],
};
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
};

const getErrorMessage = error => ERROR_MESSAGES[error] ?? ERROR_MESSAGES.default;
const NFT = props => {
  const { id: tokenId } = useParams();
  const { t } = useTranslation();
  const { error, disclaimer } = props;

  document.title = `${t('xrpl_explorer')} | ${tokenId.substr(0, 12)}...`;

  useEffect(() => {
    analytics(ANALYTIC_TYPES.pageview, { title: 'NFT', path: '/token/:id' });
    return () => {
      window.scrollTo(0, 0);
    };
  }, []);

  const renderError = () => {
    const message = getErrorMessage(error);
    return (
      <div className="token-page">
        <NoMatch title={message.title} hints={message.hints} />
      </div>
    );
  };

  const renderDisclaimer = () => {
    return (
      <div className="disclaimer-container">
        <div className="disclaimer-left">{disclaimer.content}</div>
        <div className="disclaimer-right">{disclaimer.date}</div>
      </div>
    );
  };

  return error ? (
    renderError()
  ) : (
    <div className="token-page">
      {tokenId && <NFTHeader tokenId={tokenId} />}
      {tokenId && disclaimer && renderDisclaimer()}
      {!tokenId && (
        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <h2>Enter a NFT ID in the search box</h2>
        </div>
      )}
    </div>
  );
};

NFT.propTypes = {
  error: PropTypes.number,
  disclaimer: PropTypes.shape({
    content: PropTypes.string,
    date: PropTypes.string,
  }),
};

NFT.defaultProps = {
  error: null,
  disclaimer: null,
};

export default connect(state => ({
  width: state.app.width,
  error: state.NFTHeader.status,
}))(withTranslation()(NFT));
