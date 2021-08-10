import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { translate } from 'react-i18next';

import { analytics, ANALYTIC_TYPES } from '../shared/utils';
import Log from '../shared/log';
import TokensHeader from './TokensHeader';
import TokensTable from './TokensTable';
import './styles.css';

const TOP_TOKENS_URL = '/api/v1/token/top';

const Tokens = props => {
  const [allTokens, setAllTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { t, error } = props;

  document.title = `${t('xrpl_explorer')} | ${t('tokens')}`;

  useEffect(() => {
    axios
      .get(TOP_TOKENS_URL)
      .then(res => {
        const { tokens } = res.data;
        setAllTokens(tokens);
        setIsLoading(false);
      })
      .catch(axiosError => {
        Log.error(`${TOP_TOKENS_URL} --- ${JSON.stringify(axiosError)}`);

        analytics(ANALYTIC_TYPES.exception, {
          exDescription: `${TOP_TOKENS_URL} --- ${JSON.stringify(axiosError)}`,
        });

        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  return error ? (
    Tokens.renderError(error)
  ) : (
    <div className="token-discovery-page">
      <TokensHeader tokens={allTokens} isLoading={isLoading} isError={isError} />
      <TokensTable allTokens={allTokens} isError={isError} />
    </div>
  );
};

Tokens.propTypes = {
  t: PropTypes.func.isRequired,
  error: PropTypes.number,
};

Tokens.defaultProps = {
  error: null,
};

export default translate()(Tokens);
