import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Loader from '../../shared/components/Loader';
import './styles.css';

const TokensHeader = props => {
  const { t, tokens, isLoading, isError } = props;

  const [totalIssuers, setTotalIssuers] = useState();
  const [totalTokens, setTotalTokens] = useState();

  useEffect(() => {
    if (!isError) {
      /**
       * Data manipulation for Total Issuers
       */

      // Get an array containing the 'issuers' only, without 'currency', 'obligations' and 'trustlines'
      const allIssuers = tokens.map(token => {
        return token.issuer;
      });

      // Remove the duplicates from this 'allIssuers' array with a Set
      setTotalIssuers(new Set(allIssuers).size);

      /**
       * Total Tokens
       */

      setTotalTokens(tokens.length);
    } else {
      setTotalIssuers('N/A');
      setTotalTokens('N/A');
    }
  }, [tokens, isError]);

  return (
    <div className="tokens-header-container">
      <div className="title">{t('tokens')}</div>

      <div className="total-group">
        <div className="total-issuers-container">
          <div className="label">{t('total_issuers')}</div>
          <div className="value">{isLoading ? <Loader /> : totalIssuers}</div>
        </div>
        <div className="total-tokens-container">
          <div className="label">{t('total_tokens')}</div>
          <div className="value">{isLoading ? <Loader /> : totalTokens}</div>
        </div>
      </div>
    </div>
  );
};

TokensHeader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      issuer: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired,
      trustlines: PropTypes.number.isRequired,
      volume: PropTypes.number
    })
  ).isRequired,
  isError: PropTypes.bool.isRequired
};

export default translate()(TokensHeader);
